import { describe, it, expect } from '@jest/globals';
import * as db from '../db.js';

describe('Database Operations', () => {
  describe('Location CRUD functions exist', () => {
    it('should export getAllLocations function', () => {
      expect(typeof db.getAllLocations).toBe('function');
    });

    it('should export getLocationById function', () => {
      expect(typeof db.getLocationById).toBe('function');
    });

    it('should export createLocation function', () => {
      expect(typeof db.createLocation).toBe('function');
    });

    it('should export updateLocation function', () => {
      expect(typeof db.updateLocation).toBe('function');
    });

    it('should export deleteLocation function', () => {
      expect(typeof db.deleteLocation).toBe('function');
    });
  });
});
