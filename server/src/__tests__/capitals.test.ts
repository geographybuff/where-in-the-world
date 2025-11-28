import { describe, it, expect } from '@jest/globals';
import { findCountryCapital, findMatchingCountries } from '../capitals.js';

describe('capitals', () => {
  describe('findCountryCapital', () => {
    it('finds capital for exact country match', () => {
      const result = findCountryCapital('france');
      expect(result).toEqual({ capital: 'Paris', country: 'France' });
    });

    it('finds capital for country with different casing', () => {
      const result = findCountryCapital('JAPAN');
      expect(result).toEqual({ capital: 'Tokyo', country: 'Japan' });
    });

    it('returns null for unknown country', () => {
      const result = findCountryCapital('atlantis');
      expect(result).toBeNull();
    });

    it('finds capital for poland', () => {
      const result = findCountryCapital('poland');
      expect(result).toEqual({ capital: 'Warsaw', country: 'Poland' });
    });
  });

  describe('findMatchingCountries', () => {
    it('finds countries matching partial query', () => {
      const results = findMatchingCountries('uni');
      const countryNames = results.map((r: { country: string; capital: string }) => r.country);
      
      expect(countryNames).toContain('United States');
      expect(countryNames).toContain('United Kingdom');
    });

    it('returns empty array for no matches', () => {
      const results = findMatchingCountries('xyz123');
      expect(results).toEqual([]);
    });

    it('returns multiple matching results', () => {
      const results = findMatchingCountries('a');
      expect(results.length).toBeGreaterThan(0);
      // Many countries start with 'a' so we just check we get results
    });

    it('is case insensitive', () => {
      const results = findMatchingCountries('FRANCE');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].country).toBe('France');
    });
  });
});
