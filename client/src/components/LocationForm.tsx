import { useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FAMILY_MEMBERS, LocationInput } from '../types';
import { createLocation, geocodeAddress, GeocodeResult } from '../api';

interface LocationFormProps {
  onLocationAdded: () => void;
}

export default function LocationForm({ onLocationAdded }: LocationFormProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [geocodeResults, setGeocodeResults] = useState<GeocodeResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeocodeResult | null>(null);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const [familyMembers, setFamilyMembers] = useState<{ value: string; label: string }[]>([]);
  const [postcard, setPostcard] = useState<File | null>(null);
  const [postcardPreview, setPostcardPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddressSearch = async () => {
    if (!address.trim()) {
      setError('Please enter an address to search');
      return;
    }

    setError(null);
    setSearchingAddress(true);
    setGeocodeResults([]);
    setSelectedLocation(null);

    try {
      const results = await geocodeAddress(address.trim());
      setGeocodeResults(results);
      
      if (results.length === 1) {
        // If only one result, auto-select it
        setSelectedLocation(results[0]);
        if (!name.trim()) {
          // Auto-fill name if empty
          setName(results[0].formattedAddress);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search address');
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleLocationSelect = (result: GeocodeResult) => {
    setSelectedLocation(result);
    if (!name.trim()) {
      // Auto-fill name if empty
      setName(result.formattedAddress);
    }
    setGeocodeResults([]); // Hide results after selection
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
      setError('Please search for and select a location address');
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
      await createLocation(input);
      setSuccess('Location added successfully!');
      
      // Reset form
      setName('');
      setAddress('');
      setGeocodeResults([]);
      setSelectedLocation(null);
      setDate(new Date());
      setFamilyMembers([]);
      setPostcard(null);
      setPostcardPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      onLocationAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h3>Add New Location</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Location Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Paris, France (will auto-fill from address)"
          />
        </div>

        <div className="form-group">
          <label>Address Search</label>
          <div className="address-search">
            <div className="search-input-container">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Warsaw, Poland"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddressSearch())}
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                disabled={searchingAddress}
                className="search-button"
              >
                {searchingAddress ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {selectedLocation && (
              <div className="selected-location">
                <strong>Selected:</strong> {selectedLocation.formattedAddress}
                <button
                  type="button"
                  onClick={() => setSelectedLocation(null)}
                  className="clear-selection"
                >
                  ✕
                </button>
              </div>
            )}
            
            {geocodeResults.length > 0 && (
              <div className="geocode-results">
                <p><strong>Select a location:</strong></p>
                {geocodeResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(result)}
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
              {postcard ? postcard.name : 'Click to upload postcard image'}
            </span>
          </div>
          {postcardPreview && (
            <div className="file-preview">
              <img src={postcardPreview} alt="Postcard preview" />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Location'}
        </button>
      </form>
    </div>
  );
}
