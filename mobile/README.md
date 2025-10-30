# Employee Management Mobile App

A React Native mobile application that wraps the Employee Management web application in a native container, providing full mobile functionality with native features like push notifications, Bluetooth Low Energy (BLE) connectivity, and offline caching.

## Features

- **WebView Integration**: Full-screen WebView displaying your Employee Management web app
- **Native Features**:
  - Push notifications for task assignments and updates
  - Bluetooth Low Energy (BLE) support for wearable devices (Sense O'clock, etc.)
  - Camera and file upload permissions
  - Deep linking support (`employeeapp://`)
  - Offline caching with Service Workers
  - Loading animations and splash screen
  - Hardware back button support (Android)

## Prerequisites

### For Both Platforms
- Node.js 18+ installed
- npm or yarn package manager
- Git

### For Android Development
- Java Development Kit (JDK) 17
- Android Studio (Arctic Fox or later)
- Android SDK (API Level 34)
- Android SDK Build-Tools 34.0.0
- Android NDK 26.1.10909125

### For iOS Development (macOS only)
- Xcode 14.0 or later
- CocoaPods (`sudo gem install cocoapods`)
- iOS 13.4 or higher deployment target

## Installation

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

The Android project is already configured. If you need to regenerate the keystore for release builds:

```bash
./scripts/generate-keystore.sh
```

## Configuration

### Update Web App URL

Edit `App.tsx` and change the `WEB_APP_URL` constant:

```typescript
const WEB_APP_URL = 'https://your-web-app-url.com'; // Change this to your deployed URL
```

For local development, you can use:
- Android emulator: `http://10.0.2.2:5173`
- iOS simulator: `http://localhost:5173`
- Physical device: `http://YOUR_LOCAL_IP:5173`

### App Name and Bundle ID

#### Android
1. Edit `android/app/src/main/res/values/strings.xml` to change the app name
2. Edit `android/app/build.gradle` to change the `applicationId`

#### iOS
1. Open `ios/EmployeeManagementMobile.xcworkspace` in Xcode
2. Select the project → Change Bundle Identifier
3. Update Display Name in Info.plist

## Running the App

### Development Mode

#### Android
```bash
npm run android
```

Or open in Android Studio:
```bash
cd android
open -a "Android Studio" .
```

#### iOS (macOS only)
```bash
npm run ios
```

Or open in Xcode:
```bash
cd ios
open EmployeeManagementMobile.xcworkspace
```

### Start Metro Bundler
```bash
npm start
```

## Building for Production

### Android APK

Build a release APK for testing:

```bash
# Using the build script
./scripts/build-android.sh

# Or manually
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Android App Bundle (AAB)

Build an AAB for Google Play Store:

```bash
# Using the build script
./scripts/build-android-bundle.sh

# Or manually
cd android
./gradlew bundleRelease
```

The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS IPA (macOS only)

1. Open Xcode: `open ios/EmployeeManagementMobile.xcworkspace`
2. Select "Any iOS Device" as the build target
3. Go to Product → Archive
4. Once archived, click "Distribute App"
5. Choose distribution method (App Store, Ad Hoc, Enterprise)
6. Follow the wizard to export the IPA

Or use command line:
```bash
cd ios
xcodebuild -workspace EmployeeManagementMobile.xcworkspace \
  -scheme EmployeeManagementMobile \
  -configuration Release \
  -archivePath build/EmployeeManagementMobile.xcarchive \
  archive

xcodebuild -exportArchive \
  -archivePath build/EmployeeManagementMobile.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

## Signing Configuration

### Android Release Signing

1. Generate a keystore (if not already done):
```bash
./scripts/generate-keystore.sh
```

2. Create `android/gradle.properties` (keep this file secret, add to .gitignore):
```properties
MYAPP_RELEASE_STORE_FILE=release.keystore
MYAPP_RELEASE_KEY_ALIAS=employeeapp-key
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

### iOS Code Signing

1. Open Xcode
2. Select your project → Signing & Capabilities
3. Select your team
4. Xcode will automatically manage provisioning profiles

## Native Features Usage

### Push Notifications

Import and use the NotificationService:

```typescript
import NotificationService from './services/NotificationService';

// Show a notification
NotificationService.showNotification('Task Assigned', 'You have a new task');

// Show task-specific notification
NotificationService.showTaskNotification('New Task', 'Complete the report', 'task-123');
```

### Bluetooth Low Energy (BLE)

Import and use the BLEService:

```typescript
import BLEService from './services/BLEService';

// Start scanning for devices
await BLEService.startScan([], 10);

// Get discovered devices
const devices = await BLEService.getDiscoveredDevices();

// Connect to a device
const connected = await BLEService.connectToDevice(deviceId);

// Read characteristic
const data = await BLEService.readCharacteristic(deviceId, serviceUUID, characteristicUUID);
```

### Deep Linking

The app supports deep links with the scheme `employeeapp://`

Examples:
- `employeeapp://open`
- `employeeapp://open?page=dashboard`
- `employeeapp://open?taskId=123`

Import and use the DeepLinkService:

```typescript
import DeepLinkService from './services/DeepLinkService';

// Initialize deep linking
DeepLinkService.initialize();

// Add listener for deep links
DeepLinkService.addListener((url) => {
  const { path, params } = DeepLinkService.parseUrl(url);
  console.log('Deep link:', path, params);
});
```

## Testing

### Testing on Physical Devices

#### Android
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npm run android`

#### iOS (macOS only)
1. Connect your iPhone/iPad via USB
2. Trust the computer on your device
3. Select your device in Xcode
4. Run: `npm run ios --device`

### Testing Deep Links

#### Android
```bash
adb shell am start -W -a android.intent.action.VIEW -d "employeeapp://open?page=dashboard" com.employeemanagementmobile
```

#### iOS
```bash
xcrun simctl openurl booted "employeeapp://open?page=dashboard"
```

## Troubleshooting

### Android Build Issues

**Gradle build fails:**
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
```

**SDK/NDK version issues:**
- Update `android/build.gradle` with correct SDK versions
- Update Android Studio SDK Manager with required components

### iOS Build Issues

**Pod install fails:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

**Code signing issues:**
- Ensure you're logged into Xcode with your Apple ID
- Check Signing & Capabilities in Xcode project settings

### Metro Bundler Issues

**Port already in use:**
```bash
npm start -- --reset-cache
```

**Clear cache:**
```bash
npm start -- --reset-cache
rm -rf /tmp/metro-*
```

### WebView Not Loading

1. Check that your web app URL is correct in `App.tsx`
2. Ensure your device/emulator has internet connectivity
3. For local development, ensure your computer and device are on the same network
4. Check CORS settings on your web server

## Project Structure

```
mobile/
├── android/                    # Android native code
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/employeemanagementmobile/
│   │   │   └── res/
│   │   └── build.gradle
│   ├── build.gradle
│   └── gradle.properties
├── ios/                        # iOS native code
│   ├── EmployeeManagementMobile/
│   │   └── Info.plist
│   └── Podfile
├── services/                   # Native services
│   ├── NotificationService.ts  # Push notifications
│   ├── BLEService.ts          # Bluetooth Low Energy
│   └── DeepLinkService.ts     # Deep linking
├── scripts/                    # Build scripts
│   ├── build-android.sh
│   ├── build-android-bundle.sh
│   └── generate-keystore.sh
├── App.tsx                     # Main app component
├── index.js                    # App entry point
├── app.json                    # App configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## Publishing

### Google Play Store (Android)

1. Build the AAB: `./scripts/build-android-bundle.sh`
2. Go to [Google Play Console](https://play.google.com/console)
3. Create a new app or select existing
4. Upload the AAB under Release → Production
5. Fill in store listing, screenshots, and other required info
6. Submit for review

### Apple App Store (iOS)

1. Build and archive in Xcode
2. Upload to App Store Connect
3. Go to [App Store Connect](https://appstoreconnect.apple.com)
4. Create a new app or select existing
5. Fill in app information, screenshots, and description
6. Submit for review

## Permissions Required

### Android
- Internet access
- Network state
- Camera
- Read/Write external storage
- Bluetooth (BLE)
- Location (required for BLE on Android)
- Push notifications

### iOS
- Camera usage
- Photo library access
- Bluetooth usage
- Location when in use (for BLE)
- Push notifications

## Performance Tips

1. **Optimize WebView performance:**
   - Enable caching: `cacheEnabled={true}`
   - Use hardware acceleration
   - Minimize JavaScript bridge calls

2. **Reduce app size:**
   - Enable Hermes engine (already configured)
   - Use ProGuard for Android release builds
   - Optimize images and assets

3. **Improve load times:**
   - Implement splash screen (already done)
   - Use Service Workers for offline caching
   - Preload critical resources

## Support

For issues related to:
- **React Native:** [React Native Documentation](https://reactnative.dev/docs/getting-started)
- **Android Development:** [Android Developer Guide](https://developer.android.com/)
- **iOS Development:** [Apple Developer Documentation](https://developer.apple.com/documentation/)

## License

This project is part of the Employee Management System.
