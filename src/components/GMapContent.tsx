import { useRef, useState, useCallback, useEffect } from "react";

const MAP_OPTIONS = {
  center: { lat: 35.7121603851677, lng: 139.76202070318402 },
  zoom: 10,
  mapId: "DEMO_MAP_ID", // TODO: 本番環境で適切な値に変更
};

export default function GMapContent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng;

      const marker = new window.google.maps.Marker({
        position: latLng,
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
