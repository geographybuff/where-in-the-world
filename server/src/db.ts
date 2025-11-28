import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'data', 'locations.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db: DatabaseType = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    date TEXT NOT NULL,
    postcard_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS location_family_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER NOT NULL,
    family_member TEXT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_location_family_members_location_id ON location_family_members(location_id);
`);

export interface LocationRow {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  date: string;
  postcard_url: string | null;
  created_at: string;
}

export interface LocationWithFamily extends LocationRow {
  familyMembers: string[];
}

export function getAllLocations(): LocationWithFamily[] {
  const locations = db.prepare(`
    SELECT * FROM locations ORDER BY date DESC
  `).all() as LocationRow[];

  return locations.map(location => {
    const familyMembers = db.prepare(`
      SELECT family_member FROM location_family_members WHERE location_id = ?
    `).all(location.id) as { family_member: string }[];

    return {
      ...location,
      familyMembers: familyMembers.map(fm => fm.family_member),
    };
  });
}

export function getLocationById(id: number): LocationWithFamily | null {
  const location = db.prepare(`
    SELECT * FROM locations WHERE id = ?
  `).get(id) as LocationRow | undefined;

  if (!location) return null;

  const familyMembers = db.prepare(`
    SELECT family_member FROM location_family_members WHERE location_id = ?
  `).all(id) as { family_member: string }[];

  return {
    ...location,
    familyMembers: familyMembers.map(fm => fm.family_member),
  };
}

export function createLocation(
  name: string,
  latitude: number,
  longitude: number,
  date: string,
  familyMembers: string[],
  postcardUrl: string | null
): LocationWithFamily {
  const insertLocation = db.prepare(`
    INSERT INTO locations (name, latitude, longitude, date, postcard_url)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertFamilyMember = db.prepare(`
    INSERT INTO location_family_members (location_id, family_member)
    VALUES (?, ?)
  `);

  const transaction = db.transaction(() => {
    const result = insertLocation.run(name, latitude, longitude, date, postcardUrl);
    const locationId = result.lastInsertRowid as number;

    for (const member of familyMembers) {
      insertFamilyMember.run(locationId, member);
    }

    return locationId;
  });

  const locationId = transaction();
  return getLocationById(locationId as number)!;
}

export function deleteLocation(id: number): boolean {
  const deleteFamilyMembers = db.prepare(`
    DELETE FROM location_family_members WHERE location_id = ?
  `);

  const deleteLocationQuery = db.prepare(`
    DELETE FROM locations WHERE id = ?
  `);

  const transaction = db.transaction(() => {
    deleteFamilyMembers.run(id);
    const result = deleteLocationQuery.run(id);
    return result.changes > 0;
  });

  return transaction();
}

export default db;
