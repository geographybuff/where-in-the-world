import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Location, FAMILY_MEMBERS } from '../types';
import { deleteLocation } from '../api';

interface LocationListProps {
  locations: Location[];
  onLocationDeleted: () => void;
}

export default function LocationList({ locations, onLocationDeleted }: LocationListProps) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  
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
        setOpenMenuId(null);
      } catch {
        alert('Failed to delete location');
      }
    }
  };

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
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
          <div className="location-item-header">
            <div>
              <h4>{location.name}</h4>
              <p><strong>Date:</strong> {new Date(location.date).toLocaleDateString()}</p>
            </div>
            <div className="location-menu">
              <button 
                className="gear-button"
                onClick={() => toggleMenu(location.id)}
                aria-label="Options"
              >
                ⚙️
              </button>
              {openMenuId === location.id && (
                <div className="dropdown-menu">
                  <button onClick={() => {
                    navigate(`/edit/${location.id}`);
                    setOpenMenuId(null);
                  }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(location.id)}>
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          </div>
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
        </div>
      ))}
    </div>
  );
}
