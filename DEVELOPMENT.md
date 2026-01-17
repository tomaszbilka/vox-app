# Development Guide

This guide explains how to work with the Vox App in development mode.

## Prerequisites

1. Node.js 18+ and npm
2. Expo CLI
3. EAS CLI (for builds)
4. iOS Simulator (for iOS) or Android Emulator (for Android)
5. Physical device (recommended for testing WebRTC)

## Initial Setup

1. **Install Dependencies:**

```bash
npm install
```

2. **Configure Environment:**
   Create a `.env` file in the project root:

```env
EXPO_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com
EXPO_PUBLIC_BACKEND_URL=https://your-backend.netlify.app/.netlify/functions
```

3. **Prebuild Native Code:**

```bash
npx expo prebuild
```

## Development Workflow

### Running in Development Mode

**Important:** LiveKit requires a development build. Expo Go will NOT work.

1. **Start Expo Dev Server:**

```bash
npm start
```

2. **Run on Device/Simulator:**

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Development Build

If you need to create a new development build:

```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

## Project Structure

```
vox-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   ├── guide.tsx          # Guide screen route
│   └── listener.tsx       # Listener screen route
├── components/            # React components
│   ├── guide-screen/     # Guide screen component
│   └── listener-screen/  # Listener screen component
├── services/             # Business logic
│   ├── api/             # API services
│   └── livekit/         # LiveKit integration
├── hooks/               # Custom React hooks
├── config/              # Configuration files
└── utils/               # Utility functions
```

## Key Components

### Guide Screen

- Location: `components/guide-screen/guide-screen.tsx`
- Features:
  - Generates and displays room ID
  - Requests microphone permission
  - Connects to LiveKit room
  - Publishes audio stream
  - Shows listener count

### Listener Screen

- Location: `components/listener-screen/listener-screen.tsx`
- Features:
  - Input for room ID
  - Connects to LiveKit room
  - Automatically subscribes to guide's audio

### LiveKit Hook

- Location: `services/livekit/useLiveKitRoom.ts`
- Manages:
  - Room connection
  - Audio publishing/subscribing
  - Participant tracking
  - Error handling

## Testing

### Manual Testing Checklist

1. **Guide Flow:**
   - [ ] Select "Guide" role
   - [ ] Room ID is generated and displayed
   - [ ] Microphone permission is requested
   - [ ] Token is fetched successfully
   - [ ] Connection to LiveKit succeeds
   - [ ] "Speak" button publishes audio
   - [ ] Listener count updates correctly

2. **Listener Flow:**
   - [ ] Select "Listener" role
   - [ ] Enter valid room ID
   - [ ] Token is fetched successfully
   - [ ] Connection to LiveKit succeeds
   - [ ] Audio from guide is received

3. **Multiple Rooms:**
   - [ ] Multiple guides can operate simultaneously
   - [ ] Multiple listeners can join different rooms
   - [ ] No cross-room audio interference

4. **Error Handling:**
   - [ ] Invalid room ID shows error
   - [ ] Token fetch failure shows error
   - [ ] Connection failure shows error
   - [ ] Retry buttons work correctly

## Debugging

### Viewing Logs

```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

### Common Issues

1. **"Module not found" errors:**
   - Run `npm install`
   - Clear Metro cache: `npm start -- --reset-cache`

2. **Native module errors:**
   - Run `npx expo prebuild --clean`
   - Rebuild the app

3. **LiveKit connection failures:**
   - Verify `LIVEKIT_SERVER_URL` is correct
   - Check backend token endpoint
   - Review network connectivity

4. **Audio not working:**
   - Check microphone permissions
   - Verify device/simulator supports audio
   - Test on physical device

## Code Style

- Follow TypeScript best practices
- Use ESLint for linting: `npm run lint`
- Format code with Prettier (if configured)
- Follow existing component patterns

## Building for Production

See the main README or EAS documentation for production build instructions.

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [LiveKit React Native Docs](https://docs.livekit.io/client-sdk-react-native/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
