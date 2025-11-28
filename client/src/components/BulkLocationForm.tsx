import { useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { createLocation, geocodeAddress, GeocodeResult } from '../api';
import { LocationInput } from '../types';

interface BulkLocationEntry {
  id: string;
  name: string;
  address: string;
  selectedLocation: GeocodeResult | null;
  searchingAddress: boolean;
  geocodeResults: GeocodeResult[];
  date: Date | null;
  familyMembers: string[];
  postcard: File | null;
}

interface BulkLocationFormProps {
  onLocationsAdded: () => void;
}

const familyMemberOptions = [
  { value: 'alan', label: 'Alan' },
  { value: 'deborah', label: 'Deborah' },
  { value: 'john', label: 'John' },
  { value: 'cyn', label: 'Cyn' },
  { value: 'louise', label: 'Louise' },
  { value: 'ben', label: 'Ben' },
  { value: 'michelle', label: 'Michelle' },
];

export default function BulkLocationForm({ onLocationsAdded }: BulkLocationFormProps) {
  const [locations, setLocations] = useState<BulkLocationEntry[]>([
    {
      id: '1',
      name: '',
      address: '',
      selectedLocation: null,
      searchingAddress: false,
      geocodeResults: [],
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
      address: '',
      selectedLocation: null,
      searchingAddress: false,
      geocodeResults: [],
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

  const handleAddressSearch = async (id: string) => {
    const location = locations.find(loc => loc.id === id);
    if (!location || !location.address.trim()) {
      return;
    }

    updateLocation(id, 'searchingAddress', true);
    updateLocation(id, 'geocodeResults', []);
    updateLocation(id, 'selectedLocation', null);

    try {
      const results = await geocodeAddress(location.address.trim());
      updateLocation(id, 'geocodeResults', results);
      
      if (results.length === 1) {
        // Auto-select if only one result
        updateLocation(id, 'selectedLocation', results[0]);
        if (!location.name.trim()) {
          updateLocation(id, 'name', results[0].formattedAddress);
        }
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      // You could show individual error messages per location here
    } finally {
      updateLocation(id, 'searchingAddress', false);
    }
  };

  const handleLocationSelect = (id: string, result: GeocodeResult) => {
    const location = locations.find(loc => loc.id === id);
    updateLocation(id, 'selectedLocation', result);
    updateLocation(id, 'geocodeResults', []);
    
    if (location && !location.name.trim()) {
      updateLocation(id, 'name', result.formattedAddress);
    }
  };

  const validateLocations = () => {
    for (const location of locations) {
      if (!location.name.trim()) {
        setError('All location names are required');
        return false;
      }
      if (!location.selectedLocation) {
        setError('Please search for and select an address for all locations');
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
      // Submit each location
      for (const location of locations) {
        const locationInput: LocationInput = {
          name: location.name,
          latitude: location.selectedLocation!.latitude,
          longitude: location.selectedLocation!.longitude,
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
        address: '',
        selectedLocation: null,
        searchingAddress: false,
        geocodeResults: [],
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
                  placeholder="Enter location name (will auto-fill from address)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`address-${location.id}`}>Address Search</label>
                <div className="address-search">
                  <div className="search-input-container">
                    <input
                      id={`address-${location.id}`}
                      type="text"
                      value={location.address}
                      onChange={(e) => updateLocation(location.id, 'address', e.target.value)}
                      placeholder="e.g., Warsaw, Poland"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddressSearch(location.id))}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddressSearch(location.id)}
                      disabled={location.searchingAddress}
                      className="search-button"
                    >
                      {location.searchingAddress ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  
                  {location.selectedLocation && (
                    <div className="selected-location">
                      <strong>Selected:</strong> {location.selectedLocation.formattedAddress}
                      <button
                        type="button"
                        onClick={() => updateLocation(location.id, 'selectedLocation', null)}
                        className="clear-selection"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  
                  {location.geocodeResults.length > 0 && (
                    <div className="geocode-results">
                      <p><strong>Select a location:</strong></p>
                      {location.geocodeResults.map((result, resultIndex) => (
                        <button
                          key={resultIndex}
                          type="button"
                          onClick={() => handleLocationSelect(location.id, result)}
                          className="result-item"
                        >
                          {result.formattedAddress}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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