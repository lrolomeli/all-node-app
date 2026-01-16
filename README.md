# all-node-app

A unified Node.js application with multiple mini-apps for productivity and tracking.

## Features

### 1. Schedule App (`/schedule`)
Manage your schedules and appointments with customizable time slots.

### 2. Checklist App (`/checklist`)
Create and manage task checklists with persistent state.

### 3. Maintenance Tracker (`/maintenance`)
Track maintenance dates for filters, equipment, and other items. Features include:
- Log maintenance with date and time
- Categorize by item type (Water Filter, Air Filter, HVAC, etc.)
- Add descriptions and notes
- Filter records by type
- Delete old records
- Data persists in JSON file

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Access the app at `http://localhost:3000`

## Authentication

The app uses basic authentication. Default credentials:
- Username: `admin`
- Password: `secure123`

Configure via `.env` file:
```
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
PORT=3000
```