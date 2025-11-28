import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FAMILY_MEMBERS, FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function Filters({ filters, onFiltersChange }: FiltersProps) {
  return (
    <div className="filter-section">
      <h4>Filters</h4>
      
      <div className="form-group">
        <label>Family Members</label>
        <Select
          isMulti
          options={FAMILY_MEMBERS}
          value={FAMILY_MEMBERS.filter(m => filters.familyMembers.includes(m.value))}
          onChange={(selected) => {
            onFiltersChange({
              ...filters,
              familyMembers: selected ? selected.map(s => s.value) : [],
            });
          }}
          classNamePrefix="react-select"
          placeholder="Filter by family members..."
          isClearable
        />
      </div>

      <div className="filter-row">
        <div className="form-group">
          <label>Start Date</label>
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => {
              onFiltersChange({
                ...filters,
                startDate: date,
              });
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="From date..."
            isClearable
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => {
              onFiltersChange({
                ...filters,
                endDate: date,
              });
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="To date..."
            isClearable
          />
        </div>
      </div>

      <div className="form-group">
        <label>Search Location</label>
        <input
          type="text"
          value={filters.searchText}
          onChange={(e) => {
            onFiltersChange({
              ...filters,
              searchText: e.target.value,
            });
          }}
          placeholder="Search by location name..."
        />
      </div>

      <button
        className="btn btn-secondary"
        onClick={() => {
          onFiltersChange({
            familyMembers: [],
            startDate: null,
            endDate: null,
            searchText: '',
          });
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}
