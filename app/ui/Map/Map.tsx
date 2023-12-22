"use client";
import mapboxgl, {
  GeoJSONSource,
  GeolocateControl,
  LngLatLike,
} from "mapbox-gl";
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
import resolveConfig from "tailwindcss/resolveConfig";
import myConfig from "@/tailwind.config";
import "./Map.styles.css";
import { Toast } from "primereact/toast";

const tailwindConfig = resolveConfig(myConfig);

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
  const marker = useRef<mapboxgl.Marker | null>(null);
  const toastRef = useRef<Toast>(null);

  const getUserLocationDetails = useCallback(
    async (latitude: number, longitude: number) => {
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
          latitude,
          longitude,
        }));
      } else {
        toastRef.current!.show({
          severity: "error",
          summary: "Failed to get user location",
          life: 2000,
        });
      }
    },
    [setUserLocation],
  );

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

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/tappiola/clq0tewgv01os01o925c538u8",
      center: [-0.1278, 51.5074],
      zoom: 11,
    });

    if (!marker.current) {
      marker.current = new mapboxgl.Marker({
        draggable: true,
        color: tailwindConfig.theme.colors.teal["400"],
      }).setLngLat([0, 0]);

      marker.current.addTo(map.current);
    }

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
      });

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl,
        marker: false,
        countries: "GB",
        placeholder: "Find location",
      });
      map.current!.addControl(geocoder, "top-left");

      map.current!.on("click", ({ lngLat, lngLat: { lng, lat } }) => {
        geocoder.clear();
        marker.current!.setLngLat(lngLat);
        setUserLocation({ longitude: lng, latitude: lat });
        getUserLocationDetails(lat, lng);
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
          getUserLocationDetails(coordinates[1], coordinates[0]);
        },
      );

      const geoControl = new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        showUserLocation: true,
      });
      map.current!.addControl(geoControl, "top-right");

      geoControl.on("geolocate", (listener) => {
        const {
          coords: { latitude, longitude },
        } = listener as { coords: { latitude: number; longitude: number } };
        getUserLocationDetails(latitude, longitude);
        geocoder.clear();
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
  }, [getUserLocationDetails, generateFeature, setUserLocation]);

  useEffect(() => {
    if (map.current && userLocation.latitude && userLocation.longitude) {
      map.current.flyTo({
        center: getCoordinates(userLocation),
        zoom: 17,
      });
      marker.current!.setLngLat(getCoordinates(userLocation));
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

  return (
    <>
      <Toast ref={toastRef} position="bottom-right" />
      <div ref={mapContainer} className="h-full grow" id="dynamic-map" />
    </>
  );
};

export default Map;
