import { Location, LocationInput } from './types';

const API_BASE = '/api';

export interface GeocodeResult {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
}

export interface TypeaheadResult {
  formattedAddress: string;
  displayName: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  isCountryCapital?: boolean;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult[]> {
  const response = await fetch(`${API_BASE}/geocode?address=${encodeURIComponent(address)}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to geocode address');
  }
  return response.json();
}

export async function searchLocationsTypeahead(query: string): Promise<TypeaheadResult[]> {
  if (!query.trim() || query.trim().length < 2) {
    return [];
  }
  
  const response = await fetch(`${API_BASE}/geocode/typeahead?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${API_BASE}/locations`);
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  return response.json();
}

export async function createLocation(input: LocationInput): Promise<Location> {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('latitude', input.latitude.toString());
  formData.append('longitude', input.longitude.toString());
  formData.append('date', input.date);
  formData.append('familyMembers', JSON.stringify(input.familyMembers));
  
  if (input.postcard) {
    formData.append('postcard', input.postcard);
  }

  const response = await fetch(`${API_BASE}/locations`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create location');
  }

  return response.json();
}

export async function updateLocation(id: number, input: LocationInput): Promise<Location> {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('latitude', input.latitude.toString());
  formData.append('longitude', input.longitude.toString());
  formData.append('date', input.date);
  formData.append('familyMembers', JSON.stringify(input.familyMembers));
  
  if (input.postcard) {
    formData.append('postcard', input.postcard);
  }

  const response = await fetch(`${API_BASE}/locations/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update location');
  }

  return response.json();
}

export async function deleteLocation(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/locations/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete location');
  }
}
