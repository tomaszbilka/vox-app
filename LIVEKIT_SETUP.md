# LiveKit Setup Guide

This document describes the steps required to set up and configure LiveKit for the Vox App.

## Prerequisites

1. A LiveKit server instance (cloud or self-hosted)
2. Backend service for token generation (Go function deployed to Netlify)

## LiveKit Server Setup

### Option 1: LiveKit Cloud

1. Sign up at [LiveKit Cloud](https://cloud.livekit.io)
2. Create a new project
3. Note your WebSocket URL (e.g., `wss://your-project.livekit.cloud`)
4. Get your API key and secret from the project settings

### Option 2: Self-Hosted

1. Follow the [LiveKit self-hosting guide](https://docs.livekit.io/deploy/)
2. Configure your server URL
3. Set up API keys and secrets

## Backend Token Service

The backend must provide the following endpoints:

### GET /token

**Query Parameters:**

- `role`: Either `"guide"` or `"listener"`
- `room`: The room ID (UUID)

**Response:**

```json
{
  "token": "<JWT_TOKEN>"
}
```

**Example:**

```
GET /token?role=guide&room=123e4567-e89b-12d3-a456-426614174000
```

The backend should generate a LiveKit JWT token with:

- Identity: unique identifier for the participant
- Room name: the room ID
- Permissions based on role:
  - `guide`: can publish audio
  - `listener`: can subscribe to tracks

## Environment Configuration

Create a `.env` file in the project root (or configure via Expo config):

```env
EXPO_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com
EXPO_PUBLIC_BACKEND_URL=https://your-backend.netlify.app/.netlify/functions
```

Or configure in `app.json`:

```json
{
  "expo": {
    "extra": {
      "livekitUrl": "wss://your-livekit-server.com",
      "backendUrl": "https://your-backend.netlify.app/.netlify/functions"
    }
  }
}
```

## Development Build

**Important:** LiveKit requires a development build. It will NOT work in Expo Go.

### Creating a Development Build

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Login to Expo:

```bash
eas login
```

3. Configure the project:

```bash
eas build:configure
```

4. Build for your platform:

```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

5. Install the build on your device/simulator

### Running Development Build

```bash
# Start the Expo dev server
npm start

# In another terminal, run the development build
npx expo run:ios
# or
npx expo run:android
```

## Testing

1. **Test on Physical Devices**: WebRTC may not work properly in simulators/emulators
2. **Test Microphone Permissions**: Ensure microphone permissions are granted
3. **Test Multiple Rooms**: Verify that multiple guides and listeners can operate in parallel
4. **Test Network Conditions**: Test with various network conditions (WiFi, cellular, poor connection)

## Troubleshooting

### Audio Not Working

1. Check microphone permissions are granted
2. Verify LiveKit server is accessible
3. Check token generation is working
4. Review device logs for WebRTC errors

### Connection Issues

1. Verify `LIVEKIT_SERVER_URL` is correct (must be `wss://` for secure WebSocket)
2. Check backend token endpoint is accessible
3. Verify token includes correct room name and permissions
4. Check network connectivity

### Build Issues

1. Ensure all plugins are properly configured in `app.json`
2. Run `npx expo prebuild --clean` to regenerate native code
3. Clear build cache: `eas build --clear-cache`

## Production Deployment

1. Configure production environment variables
2. Build production versions:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

3. Submit to app stores via EAS Submit or manually
