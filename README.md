# Vox App

Mobile application for real-time audio streaming using LiveKit. Enables guides to stream audio to listeners in dedicated rooms.

## Technologies

- **Framework**: Expo (React Native)
- **Routing**: Expo Router (file-based routing)
- **Audio Streaming**: LiveKit WebRTC
- **Language**: TypeScript
- **Build**: EAS Build

## Project Structure

```
vox-app/
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/            # Tab navigation
│   ├── guide.tsx          # Guide screen
│   └── listener.tsx       # Listener screen
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

## Required APIs

The application requires two external services:

1. **LiveKit Server** - WebRTC server for audio streaming
   - WebSocket URL (e.g., `wss://your-project.livekit.cloud`)
   - API Key and Secret (used by backend)

2. **Backend Token Service** - endpoint for generating JWT tokens
   - Endpoint: `GET /token?role=guide|listener&room=<room-id>`
   - Returns: `{ "token": "<jwt-token>" }`
   - Must be deployed (e.g., Netlify Functions, Render, etc.)

## Environment Configuration

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_ISDEV=true
EXPO_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
EXPO_PUBLIC_BACKEND_URL=https://your-backend.com/.netlify/functions
EXPO_PUBLIC_MOBILE_API_KEY=your-api-key
```

## 1. Local Setup (after cloning the repo)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables in .env file

# 3. Generate native code
npx expo prebuild

# 4. Start development server
npm start
```

## 2. Running on Simulators

### iOS Simulator (requires Mac)

```bash
npx expo run:ios
```

**Note**: WebRTC may not work properly in iOS Simulator (no microphone access). The simulator is useful for testing UI, but not for audio functionality.

### Android Emulator

```bash
# Make sure Android Studio and SDK are installed
npx expo run:android
```

**Note**: WebRTC may not work properly in Android Emulator. Test on a physical device for full functionality.

## 3. Running on Physical Devices

### iOS (requires Mac)

1. Connect iPhone via USB
2. Trust the computer on your phone (if prompted)
3. Run:

```bash
npx expo run:ios --device
```

### Android

1. Enable Developer Mode on your phone:
   - Settings → About phone → Tap "Build number" 7 times
2. Enable USB Debugging:
   - Settings → Developer options → USB Debugging
3. Connect phone via USB
4. Verify connection:
   ```bash
   adb devices
   ```
5. Run:

```bash
npx expo run:android
```

**Important**: If the backend runs locally on `localhost`, you must use your computer's IP address in `.env` instead of `localhost` (the phone cannot connect to the computer's `localhost`).

## 4. Preview Build (for downloading to devices)

Preview build creates an installable application (APK for Android, IPA for iOS) for testing on physical devices.

### Setup

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Login:

```bash
eas login
```

3. Configure project (one-time):

```bash
eas build:configure
```

### Preview Build

#### Android (APK)

```bash
eas build --platform android --profile preview
```

After completion, you'll receive a link to download the APK. Download it on your phone and install (allow installation from unknown sources).

#### iOS (IPA)

```bash
eas build --platform ios --profile preview
```

You'll receive an IPA. Easiest to install via TestFlight (after submitting the build to App Store Connect) or via Ad Hoc distribution.

### Environment Variables for Preview

For preview builds, you can set environment variables in EAS Secrets:

```bash
eas secret:create --name EXPO_PUBLIC_LIVEKIT_URL --value "wss://your-server.livekit.cloud" --scope project
eas secret:create --name EXPO_PUBLIC_BACKEND_URL --value "https://your-backend.com" --scope project
eas secret:create --name EXPO_PUBLIC_MOBILE_API_KEY --value "your-api-key" --scope project
```

## Important Notes

- ⚠️ **LiveKit requires Development Build** - the app **will NOT work in Expo Go**
- ⚠️ **WebRTC works best on physical devices** - simulators may have audio issues
- ⚠️ **Microphone requires permissions** - the app will request them automatically
- ⚠️ **Backend must be available** - verify that the `/token` endpoint works correctly

## Troubleshooting

### "Unable to resolve module"

```bash
npm install
npx expo prebuild
```

### App doesn't connect to development server

- Check if phone and computer are on the same WiFi network
- Or use tunnel: `npm start -- --tunnel`

### LiveKit/WebRTC errors

- Make sure you're using a development build (not Expo Go)
- Check if `npx expo prebuild` completed successfully
- Check if environment variables are set correctly

### Android - "Network request failed"

If the backend runs locally, use your computer's IP address in `.env` instead of `localhost`:

```bash
# Find computer IP
ipconfig getifaddr en0  # macOS
# Or
ifconfig | grep "inet " | grep -v 127.0.0.1

# Set in .env
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:8888  # Replace with your IP
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [LiveKit React Native Docs](https://docs.livekit.io/client-sdk-react-native/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
