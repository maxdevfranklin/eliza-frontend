# Environment Configuration

This project supports dynamic URL configuration based on environment variables.

## Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and set your desired launch mode:
   ```env
   # For production Railway deployment
   REACT_APP_LAUNCH_MODE=PRODUCTION_URL
   ```
   
   Or for local development:
   ```env
   # For local development
   REACT_APP_LAUNCH_MODE=DEVELOPMENT_LOCAL
   ```

## Launch Mode Options

### `DEVELOPMENT_LOCAL` (Default)
- **Message API**: `http://localhost:3000/{agentId}/message`
- **Auth API**: `http://localhost:{REACT_APP_AUTH_PORT}/auth/*` (default: 3002)
- Use this for local development when running the backend locally

### `PRODUCTION_URL` or `DEVELOPEMENT_URL`
- **Message API**: `https://eliza-backend-production-4791.up.railway.app/{agentId}/message`
- **Auth API**: `https://eliza-backend-production-4791.up.railway.app/auth/*`
- Use this to connect to the production Railway deployment

**Note**: For production deployment, both services use the same base URL, but for local development they use separate ports for easier debugging.

## How It Works

The configuration is handled by `src/config/api.ts`, which:
- Reads the `REACT_APP_LAUNCH_MODE` environment variable
- Returns appropriate URLs based on the mode
- Provides helper functions `getMessageUrl()` and `getAuthUrl()`

## Usage in Code

```typescript
import { getMessageUrl, getAuthUrl } from './config/api';

// For message API calls
const response = await axios.post(getMessageUrl(), { ... });

// For auth API calls
const response = await axios.post(getAuthUrl('login'), { ... });
```

## Environment Variables

- `REACT_APP_LAUNCH_MODE`: Controls which URLs to use

Note: All React environment variables must be prefixed with `REACT_APP_` to be accessible in the frontend.

**Previous versions**: The `REACT_APP_AUTH_PORT` variable is no longer needed since both auth and message APIs now use the same port. 