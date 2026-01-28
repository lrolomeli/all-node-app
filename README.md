# all-node-app

A unified Node.js application with multiple mini-apps for productivity, portfolio, health tracking, and entertainment.

## Features

### Original Apps
1. **Schedule App** (`/schedule`) - Manage your schedules and appointments with customizable time slots
2. **Checklist App** (`/checklist`) - Firmware engineer interview checklist with persistent state  
3. **Maintenance Tracker** (`/maintenance`) - Track maintenance dates for filters, equipment, and other items

### Portfolio & Professional Apps
4. **Luis Lomeli's Portfolio** (`/portfolio`) - Personal portfolio with games, projects, work experience, and skills
5. **Professional CV** (`/cv`) - Bootstrap-styled professional resume with navigation

### Health & Fitness Apps  
6. **Diet Tracker** (`/diet`) - Spanish diet plan tracker with checkboxes and local storage persistence
7. **Gym Routine** (`/gym`) - Weekly workout routine with muscle group exercises and external links

### Fun Apps
8. **Catify** (`/catify`) - Cat-themed page with images and links

## Project Structure

```
├── server.js              # Main Express server
├── public/                # Static files served by Express
│   ├── index.html         # Main homepage with navigation
│   ├── schedule.html      # Schedule app
│   ├── checklist.html     # Checklist app  
│   ├── maintenance.html   # Maintenance tracker
│   ├── allp/             # Portfolio files
│   ├── cv/               # CV/Resume files
│   ├── diet/             # Diet tracker files
│   ├── gym/              # Gym routine files
│   └── other/            # Catify files
├── schedule-data.json     # Schedule persistence
├── checklist-state.json  # Checklist persistence
└── maintenance-data.json  # Maintenance persistence
```

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