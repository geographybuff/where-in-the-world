import { useState, useRef, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { createLocation, searchLocationsTypeahead, TypeaheadResult } from '../api';
import { LocationInput } from '../types';

interface BulkLocationEntry {
  id: string;
  name: string;
  address: string;
  selectedLocation: TypeaheadResult | null;
  searchingAddress: boolean;
  typeaheadResults: TypeaheadResult[];
  showDropdown: boolean;
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
      typeaheadResults: [],
      showDropdown: false,
      date: new Date(),
      familyMembers: [],
      postcard: null,
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const addNewLocation = () => {
    const newLocation: BulkLocationEntry = {
      id: Date.now().toString(),
      name: '',
      address: '',
      selectedLocation: null,
      searchingAddress: false,
      typeaheadResults: [],
      showDropdown: false,
      date: new Date(),
      familyMembers: [],
      postcard: null,
    };
    setLocations([...locations, newLocation]);
  };

  const removeLocation = (id: string) => {
    if (locations.length > 1) {
      setLocations(locations.filter(loc => loc.id !== id));
      // Clear debounce timer for this location
      if (debounceTimersRef.current[id]) {
        clearTimeout(debounceTimersRef.current[id]);
        delete debounceTimersRef.current[id];
      }
    }
  };

  const updateLocation = useCallback((id: string, updates: Partial<BulkLocationEntry>) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, ...updates } : loc
    ));
  }, []);

  const performSearch = useCallback(async (id: string, query: string) => {
    if (query.trim().length < 2) {
      updateLocation(id, { typeaheadResults: [], showDropdown: false });
      return;
    }

    updateLocation(id, { searchingAddress: true });
    try {
      const results = await searchLocationsTypeahead(query);
      updateLocation(id, { 
        typeaheadResults: results, 
        showDropdown: results.length > 0,
        searchingAddress: false 
      });
    } catch {
      updateLocation(id, { 
        typeaheadResults: [], 
        showDropdown: false,
        searchingAddress: false 
      });
    }
  }, [updateLocation]);

  const handleAddressChange = (id: string, value: string) => {
    updateLocation(id, { address: value });
    
    // Clear existing debounce timer for this location
    if (debounceTimersRef.current[id]) {
      clearTimeout(debounceTimersRef.current[id]);
    }
    
    // Set new debounce timer
    debounceTimersRef.current[id] = setTimeout(() => {
      performSearch(id, value);
    }, 300);
  };

  const handleLocationSelect = (id: string, result: TypeaheadResult) => {
    const location = locations.find(loc => loc.id === id);
    const updates: Partial<BulkLocationEntry> = {
      selectedLocation: result,
      address: result.displayName,
      typeaheadResults: [],
      showDropdown: false,
    };
    
    if (location && !location.name.trim()) {
      updates.name = result.formattedAddress;
    }
    
    updateLocation(id, updates);
  };

  const validateLocations = () => {
    for (const location of locations) {
      if (!location.name.trim()) {
        setError('All location names are required');
        return false;
      }
      if (!location.selectedLocation) {
        setError('Please search for and select a location for all entries');
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
        typeaheadResults: [],
        showDropdown: false,
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
                  onChange={(e) => updateLocation(location.id, { name: e.target.value })}
                  placeholder="Enter location name (will auto-fill from search)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor={`address-${location.id}`}>Search Location</label>
                <div className="address-search typeahead-container">
                  <div className="typeahead-input-wrapper">
                    <input
                      id={`address-${location.id}`}
                      type="text"
                      value={location.address}
                      onChange={(e) => handleAddressChange(location.id, e.target.value)}
                      onFocus={() => {
                        if (location.typeaheadResults.length > 0) {
                          updateLocation(location.id, { showDropdown: true });
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding to allow click on dropdown items
                        setTimeout(() => {
                          updateLocation(location.id, { showDropdown: false });
                        }, 200);
                      }}
                      placeholder="Type a city or country name..."
                      className="typeahead-input"
                      autoComplete="off"
                    />
                    {location.searchingAddress && (
                      <span className="typeahead-spinner" aria-label="Searching">⏳</span>
                    )}
                  </div>
                  
                  {location.showDropdown && location.typeaheadResults.length > 0 && (
                    <div className="typeahead-dropdown">
                      {location.typeaheadResults.map((result, resultIndex) => (
                        <button
                          key={resultIndex}
                          type="button"
                          onClick={() => handleLocationSelect(location.id, result)}
                          className={`typeahead-item ${result.isCountryCapital ? 'capital-result' : ''}`}
                        >
                          <span className="typeahead-item-name">{result.displayName}</span>
                          {result.isCountryCapital && (
                            <span className="typeahead-item-badge">🏛️ Capital</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {location.selectedLocation && (
                    <div className="selected-location">
                      <strong>Selected:</strong> {location.selectedLocation.formattedAddress}
                      {location.selectedLocation.isCountryCapital && (
                        <span className="capital-badge">🏛️ Capital</span>
                      )}
                      <button
                        type="button"
                        onClick={() => updateLocation(location.id, { 
                          selectedLocation: null, 
                          address: '' 
                        })}
                        className="clear-selection"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <p className="form-hint">Search for cities or countries. For countries, the capital will be used.</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`date-${location.id}`}>Date</label>
                <DatePicker
                  id={`date-${location.id}`}
                  selected={location.date}
                  onChange={(date) => updateLocation(location.id, { date })}
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
                    updateLocation(location.id, { familyMembers: values });
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
                    updateLocation(location.id, { postcard: file });
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