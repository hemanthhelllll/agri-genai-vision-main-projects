import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  location: { lat: number; lon: number };
  onLocationSelect: (lat: number, lon: number) => void;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapUpdater({ location }: { location: { lat: number; lon: number } }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([location.lat, location.lon], map.getZoom());
  }, [location.lat, location.lon, map]);
  
  return null;
}

export const LocationMap = ({ location, onLocationSelect }: LocationMapProps) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border shadow-soft">
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={10}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lon]} />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        <MapUpdater location={location} />
      </MapContainer>
    </div>
  );
};
