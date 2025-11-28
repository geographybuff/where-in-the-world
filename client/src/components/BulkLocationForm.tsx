import { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { createLocation } from '../api';
import { LocationInput } from '../types';

interface BulkLocationEntry {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  date: Date | null;
  familyMembers: string[];
  postcard: File | null;
}

interface BulkLocationFormProps {
  onLocationsAdded: () => void;
}

const familyMemberOptions = [
  { value: 'Alan', label: 'Alan' },
  { value: 'Deborah', label: 'Deborah' },
  { value: 'John', label: 'John' },
  { value: 'Cyn', label: 'Cyn' },
  { value: 'Louise', label: 'Louise' },
  { value: 'Ben', label: 'Ben' },
  { value: 'Michelle', label: 'Michelle' },
];

export default function BulkLocationForm({ onLocationsAdded }: BulkLocationFormProps) {
  const [locations, setLocations] = useState<BulkLocationEntry[]>([
    {
      id: '1',
      name: '',
      latitude: '',
      longitude: '',
      date: new Date(),
      familyMembers: [],
      postcard: null,
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNewLocation = () => {
    const newLocation: BulkLocationEntry = {
      id: Date.now().toString(),
      name: '',
      latitude: '',
      longitude: '',
      date: new Date(),
      familyMembers: [],
      postcard: null,
    };
    setLocations([...locations, newLocation]);
  };

  const removeLocation = (id: string) => {
    if (locations.length > 1) {
      setLocations(locations.filter(loc => loc.id !== id));
    }
  };

  const updateLocation = (id: string, field: keyof BulkLocationEntry, value: any) => {
    setLocations(locations.map(loc => 
      loc.id === id ? { ...loc, [field]: value } : loc
    ));
  };

  const validateLocations = () => {
    for (const location of locations) {
      if (!location.name.trim()) {
        setError('All location names are required');
        return false;
      }
      if (!location.latitude || !location.longitude) {
        setError('All coordinates are required');
        return false;
      }
      if (isNaN(Number(location.latitude)) || isNaN(Number(location.longitude))) {
        setError('Coordinates must be valid numbers');
        return false;
      }
      if (!location.date) {
        setError('All dates are required');
        return false;
      }
      if (location.familyMembers.length === 0) {
        setError('At least one family member must be selected for each location');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateLocations()) {
      return;
    }

    setSubmitting(true);

    try {
      // Submit each location using the correct API format
      for (const location of locations) {
        const locationInput: LocationInput = {
          name: location.name,
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          date: location.date!.toISOString().split('T')[0],
          familyMembers: location.familyMembers,
          postcard: location.postcard || undefined,
        };

        await createLocation(locationInput);
      }

      // Reset form
      setLocations([{
        id: '1',
        name: '',
        latitude: '',
        longitude: '',
        date: new Date(),
        familyMembers: [],
        postcard: null,
      }]);

      onLocationsAdded();
    } catch (err) {
      setError('Failed to add locations. Please try again.');
      console.error('Error adding locations:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bulk-location-form">
      <div className="bulk-form-header">
        <h2>Bulk Add Locations</h2>
        <button
          type="button"
          onClick={addNewLocation}
          className="add-location-button"
        >
          + Add Another Location
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="locations-list">
        {locations.map((location, index) => (
          <div key={location.id} className="location-entry">
            <div className="entry-header">
              <h3>Location {index + 1}</h3>
              {locations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(location.id)}
                  className="remove-button"
                  aria-label={`Remove location ${index + 1}`}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor={`name-${location.id}`}>Location Name</label>
                <input
                  id={`name-${location.id}`}
                  type="text"
                  value={location.name}
                  onChange={(e) => updateLocation(location.id, 'name', e.target.value)}
                  placeholder="Enter location name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`latitude-${location.id}`}>Latitude</label>
                <input
                  id={`latitude-${location.id}`}
                  type="number"
                  step="any"
                  value={location.latitude}
                  onChange={(e) => updateLocation(location.id, 'latitude', e.target.value)}
                  placeholder="e.g., 40.7128"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`longitude-${location.id}`}>Longitude</label>
                <input
                  id={`longitude-${location.id}`}
                  type="number"
                  step="any"
                  value={location.longitude}
                  onChange={(e) => updateLocation(location.id, 'longitude', e.target.value)}
                  placeholder="e.g., -74.0060"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`date-${location.id}`}>Date</label>
                <DatePicker
                  id={`date-${location.id}`}
                  selected={location.date}
                  onChange={(date) => updateLocation(location.id, 'date', date)}
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`family-${location.id}`}>Family Members</label>
                <Select
                  inputId={`family-${location.id}`}
                  isMulti
                  options={familyMemberOptions}
                  value={familyMemberOptions.filter(option => 
                    location.familyMembers.includes(option.value)
                  )}
                  onChange={(selectedOptions) => {
                    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                    updateLocation(location.id, 'familyMembers', values);
                  }}
                  placeholder="Select family members"
                />
              </div>

              <div className="form-group">
                <label htmlFor={`postcard-${location.id}`}>Postcard (Optional)</label>
                <input
                  id={`postcard-${location.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    updateLocation(location.id, 'postcard', file);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={submitting}
          className="submit-button"
        >
          {submitting ? 'Adding Locations...' : `Add ${locations.length} Location${locations.length > 1 ? 's' : ''}`}
        </button>
      </div>
    </form>
  );
}