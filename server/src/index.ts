import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer, { FileFilterCallback } from 'multer';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import NodeGeocoder from 'node-geocoder';
import { getAllLocations, createLocation, deleteLocation, getLocationById } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Initialize geocoder
const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null,
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});

// Stricter rate limit for write operations
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 write requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use('/api', limiter);

// Allowed family members
const ALLOWED_FAMILY_MEMBERS = ['alan', 'deborah', 'john', 'cyn', 'louise', 'ben', 'michelle'];

// Add geocoding endpoint
app.get('/api/geocode', async (req: Request, res: Response) => {
  try {
    const { address } = req.query;
    
    if (!address || typeof address !== 'string') {
      res.status(400).json({ message: 'Address parameter is required' });
      return;
    }

    const results = await geocoder.geocode(address);
    
    if (results.length === 0) {
      res.status(404).json({ message: 'No results found for this address' });
      return;
    }

    // Return up to 5 results with formatted data
    const formattedResults = results.slice(0, 5).map(result => ({
      formattedAddress: result.formattedAddress,
      latitude: result.latitude,
      longitude: result.longitude,
      city: result.city,
      state: result.state,
      country: result.country,
      countryCode: result.countryCode,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ message: 'Failed to geocode address' });
  }
});

// Routes
app.get('/api/locations', (_req: Request, res: Response) => {
  try {
    const locations = getAllLocations();
    res.json(locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      date: loc.date,
      familyMembers: loc.familyMembers,
      postcardUrl: loc.postcard_url ? `/uploads/${path.basename(loc.postcard_url)}` : null,
      createdAt: loc.created_at,
    })));
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Failed to fetch locations' });
  }
});

app.get('/api/locations/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid location ID' });
      return;
    }

    const location = getLocationById(id);
    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    res.json({
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      date: location.date,
      familyMembers: location.familyMembers,
      postcardUrl: location.postcard_url ? `/uploads/${path.basename(location.postcard_url)}` : null,
      createdAt: location.created_at,
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Failed to fetch location' });
  }
});

app.post('/api/locations', writeLimiter, upload.single('postcard'), (req: Request, res: Response) => {
  try {
    const { name, latitude, longitude, date, familyMembers } = req.body;

    // Validate required fields
    if (!name || !latitude || !longitude || !date || !familyMembers) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      res.status(400).json({ message: 'Invalid latitude. Must be between -90 and 90.' });
      return;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      res.status(400).json({ message: 'Invalid longitude. Must be between -180 and 180.' });
      return;
    }

    // Validate date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
      return;
    }

    // Parse and validate family members
    let members: string[];
    try {
      members = JSON.parse(familyMembers);
      if (!Array.isArray(members)) {
        throw new Error('Family members must be an array');
      }
    } catch {
      res.status(400).json({ message: 'Invalid family members format' });
      return;
    }

    // Validate family members against allowed list
    for (const member of members) {
      if (!ALLOWED_FAMILY_MEMBERS.includes(member)) {
        res.status(400).json({ message: `Invalid family member: ${member}` });
        return;
      }
    }

    if (members.length === 0) {
      res.status(400).json({ message: 'At least one family member is required' });
      return;
    }

    // Get postcard URL if file was uploaded
    const postcardUrl = req.file ? req.file.path : null;

    const location = createLocation(name, lat, lng, date, members, postcardUrl);

    res.status(201).json({
      id: location.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      date: location.date,
      familyMembers: location.familyMembers,
      postcardUrl: location.postcard_url ? `/uploads/${path.basename(location.postcard_url)}` : null,
      createdAt: location.created_at,
    });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Failed to create location' });
  }
});

app.delete('/api/locations/:id', writeLimiter, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid location ID' });
      return;
    }

    // Get location to delete associated file
    const location = getLocationById(id);
    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    // Delete postcard file if exists
    if (location.postcard_url && fs.existsSync(location.postcard_url)) {
      fs.unlinkSync(location.postcard_url);
    }

    const deleted = deleteLocation(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Failed to delete location' });
  }
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ message: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` });
      return;
    }
    res.status(400).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
