import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import LocationList from './LocationList';
import Filters from './Filters';
import { Location, FilterState } from '../types';
import { getLocations } from '../api';

export default function MapPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState<FilterState>({
    familyMembers: [],
    startDate: null,
    endDate: null,
    searchText: '',
  });

  const fetchLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
      setError(null);
    } catch {
      setError('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      // Filter by family members
      if (filters.familyMembers.length > 0) {
        const hasMatch = filters.familyMembers.some(fm => 
          location.familyMembers.includes(fm)
        );
        if (!hasMatch) return false;
      }

      // Filter by date range
      const locationDate = new Date(location.date);
      if (filters.startDate && locationDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && locationDate > filters.endDate) {
        return false;
      }

      // Filter by search text
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        if (!location.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [locations, filters]);

  return (
    <div className="map-page">
      <header className="header">
        <h1>Where in the World</h1>
        <p>Track the Cort family's adventures around the globe</p>
        <button 
          className="add-location-nav-button"
          onClick={() => navigate('/add')}
        >
          + Add New Location
        </button>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <Filters filters={filters} onFiltersChange={setFilters} />

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              View Map
            </button>
            <button
              className={`tab ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              View List
            </button>
          </div>

          {activeTab === 'list' && (
            <LocationList
              locations={filteredLocations}
              onLocationDeleted={fetchLocations}
            />
          )}
        </aside>

        <main className="map-container">
          {activeTab === 'map' && (
            <>
              {loading ? (
                <div className="loading">Loading map...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                <MapView locations={filteredLocations} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}