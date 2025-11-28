import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Location, FAMILY_MEMBERS } from '../types';

interface MapViewProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

// Custom marker icon
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapView({ locations }: MapViewProps) {
  const getFamilyMemberLabels = (memberValues: string[]) => {
    return memberValues.map(value => {
      const member = FAMILY_MEMBERS.find(m => m.value === value);
      return member ? member.label : value;
    });
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={1}
      minZoom={1}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div className="map-popup">
              <h4>{location.name}</h4>
              <p><strong>Date:</strong> {new Date(location.date).toLocaleDateString()}</p>
              <p><strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
              <div className="family-tags">
                {getFamilyMemberLabels(location.familyMembers).map((label, i) => (
                  <span key={i} className="family-tag">{label}</span>
                ))}
              </div>
              {location.postcardUrl && (
                <img 
                  src={location.postcardUrl} 
                  alt={`Postcard from ${location.name}`}
                  style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '4px' }}
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

