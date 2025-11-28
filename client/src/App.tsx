import { useState, useEffect, useMemo } from 'react';
import MapView from './components/MapView';
import LocationForm from './components/LocationForm';
import LocationList from './components/LocationList';
import Filters from './components/Filters';
import { Location, FilterState } from './types';
import { getLocations } from './api';

export default function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');
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
    <div className="app-container">
      <header className="header">
        <h1>Where in the World</h1>
        <p>Track the Cort family's adventures around the globe</p>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <Filters filters={filters} onFiltersChange={setFilters} />

          <div className="tabs">
            <button
              className={`tab ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              Add Location
            </button>
            <button
              className={`tab ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              View List
            </button>
          </div>

          {activeTab === 'add' && (
            <LocationForm onLocationAdded={fetchLocations} />
          )}

          {activeTab === 'list' && (
            <LocationList
              locations={filteredLocations}
              onLocationDeleted={fetchLocations}
            />
          )}
        </aside>

        <main className="map-container">
          {loading ? (
            <div className="loading">Loading map...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <MapView locations={filteredLocations} />
          )}
        </main>
      </div>
    </div>
  );
}
