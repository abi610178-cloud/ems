import { Linking } from 'react-native';

class DeepLinkService {
  private listeners: ((url: string) => void)[] = [];

  initialize = () => {
    Linking.addEventListener('url', this.handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleDeepLink({ url });
      }
    });
  };

  handleDeepLink = (event: { url: string }) => {
    const { url } = event;
    console.log('Deep link received:', url);

    this.listeners.forEach((listener) => listener(url));
  };

  addListener = (listener: (url: string) => void) => {
    this.listeners.push(listener);
  };

  removeListener = (listener: (url: string) => void) => {
    this.listeners = this.listeners.filter((l) => l !== listener);
  };

  parseUrl = (url: string): { path: string; params: Record<string, string> } => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const params: Record<string, string> = {};

      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return { path, params };
    } catch (error) {
      console.error('Error parsing URL:', error);
      return { path: '', params: {} };
    }
  };

  canOpenURL = async (url: string): Promise<boolean> => {
    try {
      return await Linking.canOpenURL(url);
    } catch (error) {
      console.error('Error checking URL:', error);
      return false;
    }
  };

  openURL = async (url: string): Promise<void> => {
    try {
      const supported = await this.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };
}

export default new DeepLinkService();
