import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';

const WEB_APP_URL = 'https://localhost:5173'; // Change this to your deployed web app URL

const App = (): React.JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef<WebView>(null);

  React.useEffect(() => {
    // Hide splash screen after component mounts
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    // Handle Android back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    Alert.alert(
      'Connection Error',
      'Unable to load the application. Please check your internet connection.',
      [{ text: 'OK' }]
    );
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#1e40af" />
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsBackForwardNavigationGestures={true}
          cacheEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          userAgent="EmployeeManagementMobile/1.0"
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1e40af" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e40af',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;
