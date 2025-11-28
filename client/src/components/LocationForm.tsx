import { useState, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FAMILY_MEMBERS, LocationInput } from '../types';
import { createLocation } from '../api';

interface LocationFormProps {
  onLocationAdded: () => void;
}

export default function LocationForm({ onLocationAdded }: LocationFormProps) {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Please enter a location name');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setError('Please enter a valid latitude (-90 to 90)');
      return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      setError('Please enter a valid longitude (-180 to 180)');
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
      latitude: lat,
      longitude: lng,
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
      setLatitude('');
      setLongitude('');
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
            placeholder="e.g., Paris, France"
          />
        </div>

        <div className="coordinate-inputs">
          <div className="form-group">
            <label>Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-90 to 90"
            />
          </div>
          <div className="form-group">
            <label>Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="-180 to 180"
            />
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
