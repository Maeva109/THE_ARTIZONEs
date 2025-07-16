import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export const TestMap = () => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={[5.5, 10.5]} zoom={9} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[5.5, 10.5]} icon={L.icon({
          iconUrl: '/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}>
          <Popup>Hello</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
