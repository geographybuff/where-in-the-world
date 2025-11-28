# Where in the World

Track the Cort family's adventures around the globe! This application allows you to mark locations on a map, upload postcards, and filter by family members and dates.

## Features

- 🗺️ Interactive map with location pins
- 👨‍👩‍👧‍👦 Multi-select family members (Alan, Deborah, John, Cyn, Louise, Ben, Michelle)
- 📅 Date picker for travel dates
- 📮 Postcard image upload
- 🔍 Filters for family members, date range, and location search
- 💾 SQLite database for persistent storage

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Leaflet, React-Leaflet
- **Backend**: Express.js, TypeScript, SQLite (better-sqlite3)
- **Styling**: Custom CSS

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (required for Vite)
- npm

**Important**: If you're getting a "crypto.hash is not a function" error, you need to upgrade Node.js. Your current version (20.9.0) is not compatible with the latest Vite.

#### Upgrading Node.js

**Option 1: Using Node Version Manager (Recommended)**
```bash
# Install nvm if you don't have it
# Windows: Download from https://github.com/coreybutler/nvm-windows

# Install and use the latest LTS version
nvm install 20.19.0
nvm use 20.19.0
```

**Option 2: Direct Download**
- Download the latest Node.js LTS from [nodejs.org](https://nodejs.org/)
- Install and restart your terminal

**Verify your Node.js version:**
```bash
node --version
```

### Installation

1. Clone the repository
2. **Ensure you have Node.js 20.19+ or 22.12+**
3. Install all dependencies:

```bash
npm run install:all
```

### Development

Run both client and server in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Server (runs on port 3001)
npm run dev:server

# Terminal 2 - Client (runs on port 5173)
npm run dev:client
```

### Production Build

```bash
npm run build
npm run start
```

## Usage

1. Open the application in your browser (http://localhost:5173 in development)
2. Use the "Add Location" tab to add a new travel location:
   - Enter location name
   - Add coordinates (latitude/longitude)
   - Select the date
   - Choose family members who visited
   - Optionally upload a postcard image
3. Use the filters to find specific locations
4. Click on map pins to see location details
5. Use the "View List" tab to see all locations and delete them if needed

## API Endpoints

- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get a specific location
- `POST /api/locations` - Create a new location (multipart form data)
- `DELETE /api/locations/:id` - Delete a location

