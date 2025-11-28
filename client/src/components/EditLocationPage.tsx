import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FAMILY_MEMBERS, LocationInput, Location } from '../types';
import { updateLocation, searchLocationsTypeahead, TypeaheadResult } from '../api';

export default function EditLocationPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [typeaheadResults, setTypeaheadResults] = useState<TypeaheadResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<TypeaheadResult | null>(null);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const [familyMembers, setFamilyMembers] = useState<{ value: string; label: string }[]>([]);
  const [postcard, setPostcard] = useState<File | null>(null);
  const [postcardPreview, setPostcardPreview] = useState<string | null>(null);
  const [existingPostcardUrl, setExistingPostcardUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing location data
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const response = await fetch(`/api/locations/${id}`);
        if (!response.ok) throw new Error('Location not found');
        
        const location: Location = await response.json();
        
        setName(location.name);
        setAddress(location.name);
        setDate(new Date(location.date));
        setFamilyMembers(
          location.familyMembers.map(value => {
            const member = FAMILY_MEMBERS.find(m => m.value === value);
            return member || { value, label: value };
          })
        );
        
        // Set the selected location with the current coordinates
        setSelectedLocation({
          formattedAddress: location.name,
          displayName: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
          isCountryCapital: false,
        });
        
        if (location.postcardUrl) {
          setExistingPostcardUrl(location.postcardUrl);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load location');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadLocation();
    }
  }, [id]);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setTypeaheadResults([]);
      setShowDropdown(false);
      return;
    }

    setSearchingAddress(true);
    try {
      const results = await searchLocationsTypeahead(query);
      setTypeaheadResults(results);
      setShowDropdown(results.length > 0);
    } catch {
      setTypeaheadResults([]);
      setShowDropdown(false);
    } finally {
      setSearchingAddress(false);
    }
  }, []);

  // Handle address input change with debouncing
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostcard(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostcardPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSelect = (result: TypeaheadResult) => {
    setSelectedLocation(result);
    setAddress(result.displayName);
    if (!name.trim()) {
      setName(result.formattedAddress);
    }
    setShowDropdown(false);
    setTypeaheadResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Please enter a location name');
      return;
    }

    if (!selectedLocation) {
      setError('Please search for and select a location');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    if (familyMembers.length === 0) {
      setError('Please select at least one family member');
      return;
    }

    const input: LocationInput = {
      name: name.trim(),
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      date: date.toISOString().split('T')[0],
      familyMembers: familyMembers.map(m => m.value),
      postcard: postcard || undefined,
    };

    setLoading(true);

    try {
      await updateLocation(parseInt(id!), input);
      setSuccess('Location updated successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="add-location-page">
        <div className="loading">Loading location...</div>
      </div>
    );
  }

  return (
    <div className="add-location-page">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Map
        </button>
        <h2>Edit Location</h2>
      </div>

      <div className="form-section">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Location Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Paris, France"
            />
          </div>

          <div className="form-group">
            <label>Search Location</label>
            <div className="address-search typeahead-container">
              <div className="typeahead-input-wrapper">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={address}
                  onChange={handleAddressChange}
                  onFocus={() => {
                    if (typeaheadResults.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  placeholder="Type a city or country name..."
                  className="typeahead-input"
                  autoComplete="off"
                />
                {searchingAddress && (
                  <span className="typeahead-spinner" aria-label="Searching">⏳</span>
                )}
              </div>
              
              {showDropdown && typeaheadResults.length > 0 && (
                <div className="typeahead-dropdown" ref={dropdownRef}>
                  {typeaheadResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect(result)}
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
              
              {selectedLocation && (
                <div className="selected-location">
                  <strong>Selected:</strong> {selectedLocation.formattedAddress}
                  {selectedLocation.isCountryCapital && (
                    <span className="capital-badge">🏛️ Capital</span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocation(null);
                      setAddress('');
                    }}
                    className="clear-selection"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <p className="form-hint">Search for cities or countries. For countries, the capital will be used.</p>
          </div>

          <div className="form-group">
            <label>Date</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="form-group">
            <label>Family Members</label>
            <Select
              isMulti
              options={FAMILY_MEMBERS}
              value={familyMembers}
              onChange={(selected) => setFamilyMembers(selected ? [...selected] : [])}
              classNamePrefix="react-select"
              placeholder="Select family members..."
            />
          </div>

          <div className="form-group">
            <label>Postcard Image</label>
            {existingPostcardUrl && !postcardPreview && (
              <div className="file-preview">
                <img src={existingPostcardUrl} alt="Current postcard" />
                <p className="form-hint">Current postcard (upload a new one to replace)</p>
              </div>
            )}
            <div 
              className="file-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
              />
              <span className="file-upload-label">
                {postcard ? postcard.name : 'Click to upload new postcard image'}
              </span>
            </div>
            {postcardPreview && (
              <div className="file-preview">
                <img src={postcardPreview} alt="Postcard preview" />
                <p className="form-hint">New postcard preview</p>
              </div>
            )}
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Location'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
