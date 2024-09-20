import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

// TODO: referer 制限をかける
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAP_OPTIONS = {
  center: { lat: 35.7121603851677, lng: 139.76202070318402 },
  zoom: 10,
};

function MapContent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng;

      const marker = new window.google.maps.Marker({
        position: e.latLng,
        map,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: latLng ? `lat: ${latLng.lat()}, lng: ${latLng.lng()}` : "cannot get latLng",
      });
      infoWindow.open(map, marker);
    },
    [map]
  );

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, MAP_OPTIONS);
      setMap(newMap);
    }
  }, [mapRef, map]);

  useEffect(() => {
    if (map) {
      map.addListener("click", handleMapClick);
    }
  }, [map, handleMapClick]);

  return <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
}

function render(status: Status): ReactElement {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>;
    case Status.FAILURE:
      return <div>Failed to load Google Maps</div>;
    case Status.SUCCESS:
      return <MapContent />;
  }
}

export default function GMap() {
  return <Wrapper apiKey={API_KEY} render={render} />;
}
