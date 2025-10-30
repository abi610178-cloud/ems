# App Icons and Splash Screen Guide

This guide explains how to add custom icons and splash screens to your mobile app.

## 📱 App Icon Requirements

### Android Icons

Android requires multiple icon sizes in different densities. Place your icons in these directories:

```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png      (48x48 px)
├── mipmap-hdpi/ic_launcher.png      (72x72 px)
├── mipmap-xhdpi/ic_launcher.png     (96x96 px)
├── mipmap-xxhdpi/ic_launcher.png    (144x144 px)
└── mipmap-xxxhdpi/ic_launcher.png   (192x192 px)
```

**Round icons** (Android 7.1+):
```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher_round.png
├── mipmap-hdpi/ic_launcher_round.png
├── mipmap-xhdpi/ic_launcher_round.png
├── mipmap-xxhdpi/ic_launcher_round.png
└── mipmap-xxxhdpi/ic_launcher_round.png
```

### iOS Icons

iOS requires icons in `ios/EmployeeManagementMobile/Images.xcassets/AppIcon.appiconset/`

Required sizes:
- 20x20 pt (2x and 3x)
- 29x29 pt (2x and 3x)
- 40x40 pt (2x and 3x)
- 60x60 pt (2x and 3x)
- 1024x1024 pt (1x, for App Store)

Create a `Contents.json` file:
```json
{
  "images": [
    {
      "idiom": "iphone",
      "size": "20x20",
      "scale": "2x",
      "filename": "icon-20@2x.png"
    },
    {
      "idiom": "iphone",
      "size": "20x20",
      "scale": "3x",
      "filename": "icon-20@3x.png"
    },
    {
      "idiom": "iphone",
      "size": "29x29",
      "scale": "2x",
      "filename": "icon-29@2x.png"
    },
    {
      "idiom": "iphone",
      "size": "29x29",
      "scale": "3x",
      "filename": "icon-29@3x.png"
    },
    {
      "idiom": "iphone",
      "size": "40x40",
      "scale": "2x",
      "filename": "icon-40@2x.png"
    },
    {
      "idiom": "iphone",
      "size": "40x40",
      "scale": "3x",
      "filename": "icon-40@3x.png"
    },
    {
      "idiom": "iphone",
      "size": "60x60",
      "scale": "2x",
      "filename": "icon-60@2x.png"
    },
    {
      "idiom": "iphone",
      "size": "60x60",
      "scale": "3x",
      "filename": "icon-60@3x.png"
    },
    {
      "idiom": "ios-marketing",
      "size": "1024x1024",
      "scale": "1x",
      "filename": "icon-1024.png"
    }
  ],
  "info": {
    "version": 1,
    "author": "xcode"
  }
}
```

## 🎨 Splash Screen Setup

### Android Splash Screen

1. Create splash screen image at `android/app/src/main/res/drawable/launch_screen.png`
2. Recommended size: 1242x2436 px (iPhone X resolution)

The splash screen is already configured in:
- `MainActivity.java` (shows splash on launch)
- `App.tsx` (hides splash after WebView loads)

To customize colors, edit `android/app/src/main/res/values/styles.xml`:
```xml
<color name="primary_color">#1e40af</color>
```

### iOS Splash Screen

1. Create a LaunchScreen storyboard in Xcode:
   - Open `ios/EmployeeManagementMobile.xcworkspace`
   - Right-click on EmployeeManagementMobile folder
   - New File → Launch Screen
   - Add your logo/image

2. Or use a simple solid color splash:
   - Edit `Info.plist` → UILaunchStoryboardName

## 🛠 Tools to Generate Icons

### Recommended Online Tools:

1. **App Icon Generator**
   - https://appicon.co/
   - Upload 1024x1024 image, generates all sizes

2. **MakeAppIcon**
   - https://makeappicon.com/
   - Generates icons for both platforms

3. **Icon Kitchen (Android)**
   - https://icon.kitchen/
   - Android-specific icon generator

### Using ImageMagick (Command Line)

Install ImageMagick:
```bash
brew install imagemagick  # macOS
```

Generate Android icons:
```bash
# Create source icon (512x512 recommended)
convert source_icon.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert source_icon.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert source_icon.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert source_icon.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert source_icon.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

Generate iOS icons:
```bash
convert source_icon.png -resize 40x40 ios/.../icon-20@2x.png
convert source_icon.png -resize 60x60 ios/.../icon-20@3x.png
convert source_icon.png -resize 58x58 ios/.../icon-29@2x.png
convert source_icon.png -resize 87x87 ios/.../icon-29@3x.png
convert source_icon.png -resize 80x80 ios/.../icon-40@2x.png
convert source_icon.png -resize 120x120 ios/.../icon-40@3x.png
convert source_icon.png -resize 120x120 ios/.../icon-60@2x.png
convert source_icon.png -resize 180x180 ios/.../icon-60@3x.png
convert source_icon.png -resize 1024x1024 ios/.../icon-1024.png
```

## 📐 Design Guidelines

### Icon Design Best Practices:

1. **Simple and Recognizable**
   - Use a simple, bold design
   - Avoid fine details that won't be visible at small sizes
   - Make it recognizable at a glance

2. **Consistent Branding**
   - Match your company colors
   - Use brand elements (logo, colors)
   - Keep it consistent with your web app

3. **Platform Guidelines**
   - **Android:** Material Design guidelines
   - **iOS:** Human Interface Guidelines
   - Consider platform-specific icon shapes

4. **Color Considerations**
   - Use high contrast
   - Avoid gradients on small sizes
   - Test on both light and dark backgrounds

5. **Test on Real Devices**
   - View on actual phones
   - Check in app drawer/home screen
   - Verify at different sizes

### Splash Screen Best Practices:

1. **Keep It Simple**
   - Logo on solid background
   - Minimal text or graphics
   - Quick loading experience

2. **Brand Consistency**
   - Use brand colors
   - Display logo prominently
   - Match app theme

3. **Loading Time**
   - Should display for 1-2 seconds max
   - Don't use as loading screen for long operations
   - Transition smoothly to main content

## 🎯 Current App Branding

For the Employee Management app, the current theme uses:
- **Primary Color:** `#1e40af` (Blue)
- **App Name:** "Employee Management"
- **Suggested Icon:** Corporate/business theme with documents or people

You can create an icon that represents:
- Employee badge/ID card
- Office building
- Document with person silhouette
- Calendar with checkmark
- Team collaboration symbol

## 🔄 Updating Icons

After adding/updating icons:

**Android:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**iOS:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

Or simply rebuild the app in Xcode/Android Studio.

## ✅ Verification Checklist

- [ ] All Android icon sizes created (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- [ ] All iOS icon sizes created (20pt-60pt at 2x and 3x, plus 1024px)
- [ ] Icons look good on both light and dark backgrounds
- [ ] Round icons created for Android 7.1+
- [ ] Splash screen displays correctly
- [ ] App name is correct in launcher
- [ ] Icons tested on physical devices
- [ ] No pixelation or blurriness at any size

## 📚 Additional Resources

- [Android Icon Guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher)
- [iOS Icon Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Material Design Icons](https://material.io/design/iconography)
- [SF Symbols (iOS)](https://developer.apple.com/sf-symbols/)
