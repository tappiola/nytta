"use client";
import mapboxgl, { GeoJSONSource, LngLatLike } from "mapbox-gl";
import "./Map.style.css";
import { Feature, Point } from "geojson";
import React, { useCallback, useEffect, useRef, useState } from "react";

const MAPBOX_GL_TOKEN =
  "pk.eyJ1IjoidGFwcGlvbGEiLCJhIjoiY2t6eHhuM2N6MDYyMTJ2cDcxcDVsem8zNiJ9.OByK2fsCvb8XsvT2OYUEjA";

type DataPoint = { longitude: number; latitude: number };

const Map: React.FC = () => {
  const [userLocation, setUserLocation] = useState<LngLatLike | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const getCoordinates = (item: DataPoint) =>
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
        coordinates: userLocation,
      },
    } as Feature<Point>;
  }, [userLocation]);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_GL_TOKEN;
    if (map.current) return;

    // Create the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/outdoors-v11?optimize=true",
      center: [-0.1278, 51.5074],
      zoom: 11,
    });

    map.current.on("load", () => {
      // Add markers to map
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
          "icon-image": "lodging-11",
          "icon-size": 1.5,
          "icon-allow-overlap": true,
        },
      });

      // When clicking on a map marker
      map.current!.on("click", "places", ({ features }) => {
        if (!features) {
          return;
        }

        const match = features[0] as Feature<Point>;
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
  }, [generateFeature]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      });
    }
  }, []);

  useEffect(() => {
    if (map.current && userLocation) {
      map.current.flyTo({
        center: userLocation,
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
