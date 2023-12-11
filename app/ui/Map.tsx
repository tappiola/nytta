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
  useMemo,
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

  const marker = useMemo(
    () => new mapboxgl.Marker({ draggable: true }).setLngLat([0, 0]),
    [],
  );

  const fetchData = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_GL_TOKEN}`,
      );

      if (response.ok) {
        const { features } = await response.json();
        const { address: longName, ...other } = transformLocation(
          features as { id: string; text: string }[],
        );

        setUserLocation((userLocation) => ({
          ...userLocation,
          longName,
          ...other,
        }));
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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

  const transformLocation = (context: { id: string; text: string }[]) =>
    context.reduce<{
      [key: string]: string;
    }>((prev, { id, text }) => ({ ...prev, [id.split(".")[0]]: text }), {});

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

    marker.addTo(map.current);

    const geoControl = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      showUserLocation: true,
    });
    map.current!.addControl(geoControl, "top-right");

    geoControl.on(
      "geolocate",
      // @ts-ignore
      ({
        coords: { latitude, longitude },
      }: {
        coords: { latitude: number; longitude: number };
      }) => fetchData(latitude, longitude),
    );

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
        },
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl,
        marker: false,
        countries: "GB",
      });
      map.current!.addControl(geocoder, "top-left");

      map.current!.on("click", (e) => {
        marker.setLngLat(e.lngLat);
      });

      geocoder.on(
        "result",
        ({
          result: {
            text,
            place_name,
            context,
            geometry: { coordinates },
          },
        }) => {
          setUserLocation({
            shortName: text,
            longName: place_name,
            ...transformLocation(context as { id: string; text: string }[]),
            latitude: coordinates[1],
            longitude: coordinates[0],
          });
          fetchData(coordinates[1], coordinates[0]);
        },
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
  }, [fetchData, generateFeature, marker, setUserLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { longitude, latitude } }) => {
          setUserLocation({ longitude, latitude });
        },
      );
    }
  }, [setUserLocation]);

  useEffect(() => {
    if (map.current && userLocation.latitude && userLocation.longitude) {
      map.current.flyTo({
        center: getCoordinates(userLocation),
        zoom: 17,
      });
      marker.setLngLat(getCoordinates(userLocation));
    }
  }, [map, marker, userLocation]);

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
