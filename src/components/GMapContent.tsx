import { useRef, useState, useCallback, useEffect } from "react";

const MAP_OPTIONS = {
  center: { lat: 35.7121603851677, lng: 139.76202070318402 },
  zoom: 10,
  mapId: "DEMO_MAP_ID", // TODO: 本番環境で適切な値に変更
};

export default function GMapContent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infoWindow] = useState<google.maps.InfoWindow>(new window.google.maps.InfoWindow());

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      marker?.setMap(null);

      const latLng = e.latLng;
      const newMarker = new window.google.maps.Marker({
        position: latLng,
        map,
      });
      setMarker(newMarker);

      infoWindow.setContent(
        latLng ? `lat: ${latLng.lat()}, lng: ${latLng.lng()}` : "cannot get latLng"
      );
      infoWindow.open(map, newMarker);

      infoWindow.addListener("close", () => {
        newMarker.setMap(null);
        setMarker(null);
      });
    },
    [map, marker, infoWindow]
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
