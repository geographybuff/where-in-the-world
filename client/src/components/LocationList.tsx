import { useNavigate } from 'react-router-dom';
import { Location, FAMILY_MEMBERS } from '../types';
import { deleteLocation } from '../api';

interface LocationListProps {
  locations: Location[];
  onLocationDeleted: () => void;
}

export default function LocationList({ locations, onLocationDeleted }: LocationListProps) {
  const navigate = useNavigate();
  
  const getFamilyMemberLabels = (memberValues: string[]) => {
    return memberValues.map(value => {
      const member = FAMILY_MEMBERS.find(m => m.value === value);
      return member ? member.label : value;
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await deleteLocation(id);
        onLocationDeleted();
      } catch {
        alert('Failed to delete location');
      }
    }
  };

  if (locations.length === 0) {
    return (
      <div className="location-list">
        <p>No locations found. Add some locations or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="location-list">
      <h3>Locations ({locations.length})</h3>
      {locations.map((location) => (
        <div key={location.id} className="location-item">
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
              style={{ maxWidth: '100%', marginTop: '8px', borderRadius: '4px' }}
            />
          )}
          <div className="button-group" style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/edit/${location.id}`)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(location.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
