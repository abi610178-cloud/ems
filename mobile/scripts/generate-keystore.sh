#!/bin/bash

echo "Generating Android keystore for release signing..."

KEYSTORE_FILE="android/app/release.keystore"
KEYSTORE_ALIAS="employeeapp-key"

if [ -f "$KEYSTORE_FILE" ]; then
    echo "⚠️  Keystore already exists at $KEYSTORE_FILE"
    read -p "Do you want to overwrite it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborting..."
        exit 1
    fi
    rm "$KEYSTORE_FILE"
fi

echo "Please provide the following information for your keystore:"
read -p "Enter your first and last name: " CN
read -p "Enter your organizational unit (e.g., Engineering): " OU
read -p "Enter your organization name: " O
read -p "Enter your city or locality: " L
read -p "Enter your state or province: " ST
read -p "Enter your two-letter country code: " C

keytool -genkeypair \
    -v \
    -storetype PKCS12 \
    -keystore "$KEYSTORE_FILE" \
    -alias "$KEYSTORE_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -dname "CN=$CN, OU=$OU, O=$O, L=$L, ST=$ST, C=$C"

if [ $? -eq 0 ]; then
    echo "✅ Keystore generated successfully at $KEYSTORE_FILE"
    echo ""
    echo "⚠️  IMPORTANT: Keep this keystore file safe and secure!"
    echo "⚠️  You'll need it to sign future updates to your app."
    echo ""
    echo "Next steps:"
    echo "1. Create android/gradle.properties with:"
    echo "   MYAPP_RELEASE_STORE_FILE=release.keystore"
    echo "   MYAPP_RELEASE_KEY_ALIAS=$KEYSTORE_ALIAS"
    echo "   MYAPP_RELEASE_STORE_PASSWORD=<your password>"
    echo "   MYAPP_RELEASE_KEY_PASSWORD=<your password>"
else
    echo "❌ Keystore generation failed!"
    exit 1
fi
