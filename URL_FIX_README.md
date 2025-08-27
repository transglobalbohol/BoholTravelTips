# Bohol Travel Tips - URL Configuration Fix

## Summary of Changes

Fixed URL configurations to support both localhost development and production deployment environments.

### Updated URLs:
- **Backend Production**: https://boholtraveltips.onrender.com
- **Frontend Production**: https://www.boholtraveltips.com

## Files Updated

### Backend Changes:
1. **`backend/server.js`**
   - Updated CORS allowed origins to include `https://www.boholtraveltips.com`
   - Changed health check message to "Bohol Travel Tips API is running"

2. **`backend/.env`**
   - Added `CLIENT_URL=https://www.boholtraveltips.com`
   - Set `NODE_ENV=production`

3. **`backend/.env.example`** (New file)
   - Template for environment variables
   - Shows structure for both development and production

### Frontend Changes:
1. **`Frontend/src/services/api.ts`**
   - Updated production API URL to `https://boholtraveltips.onrender.com/api`
   - Added support for `VITE_API_URL` environment variable
   - Uses `import.meta.env.MODE` for better environment detection

2. **`Frontend/src/utils/constants.ts`**
   - Updated app name to "Bohol Travel Tips"
   - Updated production URLs to match deployment
   - Added environment variable support
   - Updated storage keys and contact info

3. **`Frontend/.env`** (New file)
   - Production environment variables

4. **`Frontend/.env.example`** (New file)
   - Template for frontend environment variables

## Environment Configuration

### Development Setup:
1. **Backend** (`backend/.env`):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

2. **Frontend** (`Frontend/.env.local`):
   ```env
   VITE_NODE_ENV=development
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_URL=http://localhost:5173
   ```

### Production Setup:
1. **Backend** (Render.com environment variables):
   ```env
   MONGODB_URI=your_production_mongodb_uri
   PORT=5000
   CLIENT_URL=https://www.boholtraveltips.com
   NODE_ENV=production
   ```

2. **Frontend** (Build environment variables):
   ```env
   VITE_NODE_ENV=production
   VITE_API_URL=https://boholtraveltips.onrender.com/api
   VITE_APP_URL=https://www.boholtraveltips.com
   ```

## How It Works

### Development Mode:
- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`
- API calls go to `http://localhost:5000/api`
- Vite proxy handles CORS during development

### Production Mode:
- Frontend deployed to `https://www.boholtraveltips.com`
- Backend deployed to `https://boholtraveltips.onrender.com`
- API calls go to `https://boholtraveltips.onrender.com/api`
- Backend CORS allows requests from production frontend

## Testing

### Local Development:
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd Frontend
npm run dev
```

### Production Build:
```bash
# Frontend
cd Frontend
npm run build
npm run preview
```

## Key Features:
- ✅ Automatic environment detection
- ✅ Environment variable support
- ✅ Proper CORS configuration
- ✅ Both localhost and production URLs working
- ✅ Clean separation of development and production configs
- ✅ Professional error handling

The application now works seamlessly in both development and production environments without manual URL changes.
