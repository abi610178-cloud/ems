#!/bin/bash

echo "Building Android APK..."

cd android

echo "Cleaning previous builds..."
./gradlew clean

echo "Building release APK..."
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "APK location: android/app/build/outputs/apk/release/app-release.apk"

    cp app/build/outputs/apk/release/app-release.apk ../EmployeeManagement.apk
    echo "APK copied to mobile/EmployeeManagement.apk"
else
    echo "❌ Build failed!"
    exit 1
fi

cd ..
