# Guide to Bohol - Local Development Setup

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Compass (or MongoDB installed locally)
- pnpm package manager

## MongoDB Setup (Local)

### Option 1: Using MongoDB Compass
1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Start MongoDB Compass
3. Connect to `mongodb://localhost:27017`
4. Create a new database called `guidetobohol`

### Option 2: Using MongoDB Community Server
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

## Project Setup

### Backend Setup
1. Navigate to Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
pnpm install
```

3. The `.env` file is already configured for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/guidetobohol
```

4. Start the backend server:
```bash
pnpm run dev
# or
node server.js
```

The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

The frontend will run on `http://localhost:5173`

## Fixed Issues

### ✅ CSS Error Fixed
- Added proper CSS custom properties to `index.css`
- Updated `tailwind.config.js` to support HSL color variables
- Fixed the `border-border` class issue

### ✅ Database Connection Fixed
- Updated `.env` to use local MongoDB: `mongodb://localhost:27017/guidetobohol`
- Database connection will automatically create the `guidetobohol` database

## API Endpoints
Once running, you can test the API:
- Health check: `GET http://localhost:5000/api/health`
- API documentation will be available for all routes

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running on port 27017
- Check if any other services are using port 27017
- Verify MongoDB Compass can connect to `mongodb://localhost:27017`

### Frontend Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Clear browser cache and restart dev server

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 5173
- Make sure these ports are available

## Next Steps
1. Start MongoDB (Compass or Service)
2. Run Backend: `cd Backend && pnpm run dev`
3. Run Frontend: `cd Frontend && pnpm run dev`
4. Visit `http://localhost:5173` to see your application
