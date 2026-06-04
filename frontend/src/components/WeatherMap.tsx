import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon using divIcon to avoid image import issues
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface WeatherMapProps {
  lat: number;
  lon: number;
  city?: string;
}

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 11);
  }, [lat, lon, map]);
  return null;
}

export default function WeatherMap({ lat, lon, city }: WeatherMapProps) {
  return (
    <div className="glass-card rounded-2xl p-4 h-full min-h-[300px]">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h3>
      </div>
      <div className="rounded-xl overflow-hidden h-[280px]">
        <MapContainer
          center={[lat, lon]}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lon]} icon={customIcon}>
            <Popup>
              <div className="text-sm font-medium">
                {city || 'Selected Location'}
                <br />
                <span className="text-xs text-gray-500">
                  {lat.toFixed(4)}, {lon.toFixed(4)}
                </span>
              </div>
            </Popup>
          </Marker>
          <MapUpdater lat={lat} lon={lon} />
        </MapContainer>
      </div>
    </div>
  );
}
