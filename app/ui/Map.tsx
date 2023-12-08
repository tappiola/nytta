"use client";
import mapboxgl, {
  GeoJSONSource,
  GeolocateControl,
  LngLatLike,
} from "mapbox-gl";
import "./Map.style.css";
import { Feature, Point } from "geojson";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { UserLocation } from "@/app/ui/types";

const MAPBOX_GL_TOKEN =
  "pk.eyJ1IjoidGFwcGlvbGEiLCJhIjoiY2t6eHhuM2N6MDYyMTJ2cDcxcDVsem8zNiJ9.OByK2fsCvb8XsvT2OYUEjA";

const Map = ({
  userLocation,
  setUserLocation,
}: {
  userLocation: UserLocation;
  setUserLocation: Dispatch<SetStateAction<UserLocation>>;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const getCoordinates = (item: UserLocation) =>
    [item.longitude, item.latitude] as LngLatLike;

  const generateFeature = useCallback(() => {
    return {
      type: "Feature",
      properties: {
        description: "description",
        id: 0,
      },
      geometry: {
        type: "Point",
        coordinates: getCoordinates(userLocation),
      },
    } as Feature<Point>;
  }, [userLocation]);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_GL_TOKEN;
    if (map.current) return;

    // Create the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12?optimize=true",
      center: [-0.1278, 51.5074],
      zoom: 11,
    });

    const geoControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      showUserLocation: true,
    });
    map.current!.addControl(geoControl, "top-right");
    geoControl.on("geolocate", (e) => console.log(e));

    map.current.on("load", () => {
      map.current!.addLayer({
        id: "places",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [generateFeature()],
          },
        },
        layout: {
          "icon-image": "lodging-12",
          "icon-size": 1.5,
          "icon-allow-overlap": true,
        },
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "GB",
      });
      map.current!.addControl(geocoder, "top-left");

      geocoder.on(
        "result",
        ({
          result: {
            text,
            place_name,
            context,
            geometry: { coordinates },
          },
        }) =>
          setUserLocation({
            shortName: text,
            longName: place_name,
            ...(context as { id: string; text: string }[]).reduce<{
              [key: string]: string;
            }>(
              (prev, { id, text }) => ({ ...prev, [id.split(".")[0]]: text }),
              {},
            ),
            latitude: coordinates[1],
            longitude: coordinates[0],
          }),
      );

      // When clicking on a map marker
      map.current!.on("click", "places", ({ features }) => {
        if (!features) {
          return;
        }

        const match = features?.[0] as Feature<Point>;
        const coordinates = match.geometry.coordinates.slice();

        // Show popup
        new mapboxgl.Popup()
          .setLngLat(coordinates as LngLatLike)
          .setHTML(match.properties?.description)
          .addTo(map.current!);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.current!.on("mouseenter", "places", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.current!.on("mouseleave", "places", () => {
        map.current!.getCanvas().style.cursor = "";
      });
    });
  }, [generateFeature, setUserLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { longitude, latitude } }) => {
          setUserLocation({ longitude, latitude });
        },
      );
    }
  }, []);

  useEffect(() => {
    if (map.current && userLocation.latitude && userLocation.longitude) {
      map.current.flyTo({
        center: getCoordinates(userLocation),
        zoom: 17,
      });
    }
  }, [map, userLocation]);

  useEffect(() => {
    if (!map.current || !map.current.getSource("places")) {
      return;
    }

    const source = map.current.getSource("places") as GeoJSONSource;
    source.setData({
      type: "FeatureCollection",
      features: [generateFeature()],
    });
  }, [generateFeature, map]);

  return <div ref={mapContainer} className="h-screen grow" id="dynamic-map" />;
};

export default Map;
