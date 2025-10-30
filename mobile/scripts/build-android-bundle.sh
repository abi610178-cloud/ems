#!/bin/bash

echo "Building Android App Bundle (AAB)..."

cd android

echo "Cleaning previous builds..."
./gradlew clean

echo "Building release AAB..."
./gradlew bundleRelease

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "AAB location: android/app/build/outputs/bundle/release/app-release.aab"

    cp app/build/outputs/bundle/release/app-release.aab ../EmployeeManagement.aab
    echo "AAB copied to mobile/EmployeeManagement.aab"
else
    echo "❌ Build failed!"
    exit 1
fi

cd ..
