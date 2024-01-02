"use client";
import mapboxgl, { GeolocateControl, LngLatLike } from "mapbox-gl";
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
  process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN || "MAPBOX_GL_TOKEN_UNDEFINED";

const MAP_CENTER: LngLatLike = [-0.1278, 51.5074];
const CUSTOM_MAP = "mapbox://styles/tappiola/clq0tewgv01os01o925c538u8";

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

  const updateUserLocation = useCallback(
    async (location: UserLocation) => {
      setUserLocation(location);

      const { longitude, latitude } = location;

      // using api to get additional location details based on coordinates
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

  const transformLocation = (context: { id: string; text: string }[]) =>
    context.reduce<{
      [key: string]: string;
    }>((prev, { id, text }) => ({ ...prev, [id.split(".")[0]]: text }), {});

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_GL_TOKEN;
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: CUSTOM_MAP,
      center: MAP_CENTER,
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
        updateUserLocation({ latitude: lat, longitude: lng });
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
          updateUserLocation({
            shortName: text,
            longName: place_name,
            ...transformLocation(context as { id: string; text: string }[]),
            latitude: coordinates[1],
            longitude: coordinates[0],
          });
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
        const { coords } = listener as {
          coords: { latitude: number; longitude: number };
        };
        updateUserLocation(coords);
        geocoder.clear();
      });

      map.current!.on("mouseenter", "places", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      map.current!.on("mouseleave", "places", () => {
        map.current!.getCanvas().style.cursor = "";
      });
    });
  }, [updateUserLocation]);

  useEffect(() => {
    if (map.current && userLocation.latitude && userLocation.longitude) {
      map.current.flyTo({
        center: getCoordinates(userLocation),
        zoom: 17,
      });
      marker.current!.setLngLat(getCoordinates(userLocation));
    }
  }, [map, userLocation]);

  return (
    <>
      <Toast ref={toastRef} position="bottom-right" />
      <div ref={mapContainer} className="h-full grow" id="dynamic-map" />
    </>
  );
};

export default Map;
