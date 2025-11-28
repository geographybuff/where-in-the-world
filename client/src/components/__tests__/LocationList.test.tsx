import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LocationList from '../LocationList';
import { Location } from '../../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LocationList Component', () => {
  const mockLocations: Location[] = [
    {
      id: 1,
      name: 'Paris, France',
      latitude: 48.8566,
      longitude: 2.3522,
      date: '2024-06-15',
      familyMembers: ['alan', 'deborah'],
      postcardUrl: undefined,
      createdAt: '2024-06-15T00:00:00Z',
    },
    {
      id: 2,
      name: 'Tokyo, Japan',
      latitude: 35.6762,
      longitude: 139.6503,
      date: '2024-08-20',
      familyMembers: ['john', 'cyn'],
      postcardUrl: '/uploads/postcard.jpg',
      createdAt: '2024-08-20T00:00:00Z',
    },
  ];

  const mockOnLocationDeleted = vi.fn();

  it('renders list of locations', () => {
    render(
      <BrowserRouter>
        <LocationList locations={mockLocations} onLocationDeleted={mockOnLocationDeleted} />
      </BrowserRouter>
    );

    expect(screen.getByText('Locations (2)')).toBeInTheDocument();
    expect(screen.getByText('Paris, France')).toBeInTheDocument();
    expect(screen.getByText('Tokyo, Japan')).toBeInTheDocument();
  });

  it('shows message when no locations', () => {
    render(
      <BrowserRouter>
        <LocationList locations={[]} onLocationDeleted={mockOnLocationDeleted} />
      </BrowserRouter>
    );

    expect(screen.getByText(/No locations found/)).toBeInTheDocument();
  });

  it('displays family member labels correctly', () => {
    render(
      <BrowserRouter>
        <LocationList locations={mockLocations} onLocationDeleted={mockOnLocationDeleted} />
      </BrowserRouter>
    );

    expect(screen.getByText('Alan')).toBeInTheDocument();
    expect(screen.getByText('Deborah')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Cyn')).toBeInTheDocument();
  });

  it('opens dropdown menu when gear button clicked', () => {
    render(
      <BrowserRouter>
        <LocationList locations={mockLocations} onLocationDeleted={mockOnLocationDeleted} />
      </BrowserRouter>
    );

    const gearButtons = screen.getAllByLabelText('Options');
    fireEvent.click(gearButtons[0]);

    expect(screen.getByText('✏️ Edit')).toBeInTheDocument();
    expect(screen.getByText('🗑️ Delete')).toBeInTheDocument();
  });

  it('navigates to edit page when edit clicked', () => {
    render(
      <BrowserRouter>
        <LocationList locations={mockLocations} onLocationDeleted={mockOnLocationDeleted} />
      </BrowserRouter>
    );

    const gearButtons = screen.getAllByLabelText('Options');
    fireEvent.click(gearButtons[0]);
    
    const editButton = screen.getByText('✏️ Edit');
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/edit/1');
  });

  it('displays postcard image when available', () => {
    render(
      <BrowserRouter>
        <LocationList locations={mockLocations} onLocationDeleted={mockOnLocationDeleted} />
      </BrowserRouter>
    );

    const postcardImages = screen.getAllByRole('img');
    expect(postcardImages.length).toBeGreaterThan(0);
    expect(postcardImages[0]).toHaveAttribute('src', '/uploads/postcard.jpg');
  });
});
