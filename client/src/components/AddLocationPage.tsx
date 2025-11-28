import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationForm from './LocationForm.tsx';
import BulkLocationForm from './BulkLocationForm.tsx';

export default function AddLocationPage() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<'single' | 'bulk'>('single');

  const handleLocationAdded = () => {
    // Optionally navigate back to map after successful add
    // navigate('/');
    console.log('Location added successfully');
  };

  return (
    <div className="add-location-page">
      <header className="page-header">
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
          aria-label="Back to map"
        >
          ← Back to Map
        </button>
        <h1>Add New Locations</h1>
        <p>Add single or multiple travel locations</p>
      </header>

      <div className="add-mode-selector">
        <button
          className={`mode-button ${activeMode === 'single' ? 'active' : ''}`}
          onClick={() => setActiveMode('single')}
        >
          Single Location
        </button>
        <button
          className={`mode-button ${activeMode === 'bulk' ? 'active' : ''}`}
          onClick={() => setActiveMode('bulk')}
        >
          Bulk Add
        </button>
      </div>

      <div className="form-container">
        {activeMode === 'single' ? (
          <LocationForm onLocationAdded={handleLocationAdded} />
        ) : (
          <BulkLocationForm onLocationsAdded={handleLocationAdded} />
        )}
      </div>
    </div>
  );
}