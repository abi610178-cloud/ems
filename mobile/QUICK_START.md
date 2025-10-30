# Quick Start Guide

Get your Employee Management mobile app running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Update Web App URL

Edit `App.tsx` line 12:
```typescript
const WEB_APP_URL = 'https://your-web-app-url.com';
```

For local testing:
- Android emulator: `http://10.0.2.2:5173`
- iOS simulator: `http://localhost:5173`

### 3. Run the App

**Android:**
```bash
npm run android
```

**iOS (macOS only):**
```bash
cd ios
pod install
cd ..
npm run ios
```

## 📱 Build for Production

### Android APK
```bash
./scripts/build-android.sh
```
Output: `EmployeeManagement.apk`

### Android App Bundle (Google Play)
```bash
./scripts/build-android-bundle.sh
```
Output: `EmployeeManagement.aab`

### iOS (Xcode required)
```bash
open ios/EmployeeManagementMobile.xcworkspace
```
Then: Product → Archive → Distribute

## 🔑 First-Time Android Release Setup

1. Generate keystore:
```bash
./scripts/generate-keystore.sh
```

2. Create `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=release.keystore
MYAPP_RELEASE_KEY_ALIAS=employeeapp-key
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_PASSWORD=your_password
```

## ✨ Features Included

- ✅ Full-screen WebView
- ✅ Push notifications
- ✅ Bluetooth Low Energy (BLE) for wearables
- ✅ Camera & file permissions
- ✅ Deep linking (`employeeapp://`)
- ✅ Offline caching
- ✅ Splash screen & loading animation
- ✅ Android hardware back button

## 🛠 Common Commands

```bash
# Start development
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build Android APK
./scripts/build-android.sh

# Build Android AAB
./scripts/build-android-bundle.sh

# Clean build
cd android && ./gradlew clean && cd ..
```

## 📞 Test Deep Links

**Android:**
```bash
adb shell am start -W -a android.intent.action.VIEW -d "employeeapp://open" com.employeemanagementmobile
```

**iOS:**
```bash
xcrun simctl openurl booted "employeeapp://open"
```

## 🐛 Quick Fixes

**Metro bundler port in use:**
```bash
npm start -- --reset-cache
```

**Android build fails:**
```bash
cd android && ./gradlew clean && cd ..
rm -rf node_modules && npm install
```

**iOS pods issue:**
```bash
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
```

## 📚 Need More Help?

See the full [README.md](./README.md) for detailed documentation.

## 🎯 What's Next?

1. Customize app icon and splash screen
2. Update app name and bundle ID
3. Configure push notifications backend
4. Set up BLE device pairing
5. Test on physical devices
6. Prepare store listings
7. Submit to app stores!

---

**Happy building! 🚀**
