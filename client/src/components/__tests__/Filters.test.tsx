import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../Filters';
import { FilterState } from '../../types';

describe('Filters Component', () => {
  const mockFilters: FilterState = {
    familyMembers: [],
    startDate: null,
    endDate: null,
    searchText: '',
  };

  const mockOnFiltersChange = vi.fn();

  it('renders filter section', () => {
    render(<Filters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('updates search text when typing', () => {
    render(<Filters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />);
    const searchInput = screen.getByPlaceholderText('Search by location name...');
    
    fireEvent.change(searchInput, { target: { value: 'Paris' } });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      searchText: 'Paris',
    });
  });

  it('clears all filters when clear button is clicked', () => {
    const filledFilters: FilterState = {
      familyMembers: ['alan'],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      searchText: 'Paris',
    };

    render(<Filters filters={filledFilters} onFiltersChange={mockOnFiltersChange} />);
    const clearButton = screen.getByText('Clear Filters');
    
    fireEvent.click(clearButton);
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      familyMembers: [],
      startDate: null,
      endDate: null,
      searchText: '',
    });
  });
});
