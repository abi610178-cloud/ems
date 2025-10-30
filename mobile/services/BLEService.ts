import BleManager, {
  Peripheral,
  PeripheralInfo,
} from 'react-native-ble-manager';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class BLEService {
  private isScanning: boolean = false;
  private connectedDevices: Set<string> = new Set();

  constructor() {
    this.initialize();
  }

  initialize = async () => {
    try {
      await BleManager.start({ showAlert: false });
      console.log('BLE Manager initialized');

      if (Platform.OS === 'android') {
        await this.requestBluetoothPermissions();
      }

      this.setupListeners();
    } catch (error) {
      console.error('BLE initialization error:', error);
    }
  };

  requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  setupListeners = () => {
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (peripheral: Peripheral) => {
      console.log('Discovered device:', peripheral.name || peripheral.id);
    });

    bleManagerEmitter.addListener('BleManagerStopScan', () => {
      this.isScanning = false;
      console.log('Scan stopped');
    });

    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', (data: any) => {
      console.log('Device disconnected:', data.peripheral);
      this.connectedDevices.delete(data.peripheral);
    });

    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', (data: any) => {
      console.log('Received data from device:', data);
    });
  };

  startScan = async (
    serviceUUIDs: string[] = [],
    seconds: number = 10,
    allowDuplicates: boolean = false
  ): Promise<void> => {
    if (this.isScanning) {
      console.log('Already scanning');
      return;
    }

    try {
      this.isScanning = true;
      await BleManager.scan(serviceUUIDs, seconds, allowDuplicates);
      console.log('Scanning started');
    } catch (error) {
      console.error('Scan error:', error);
      this.isScanning = false;
    }
  };

  stopScan = async (): Promise<void> => {
    try {
      await BleManager.stopScan();
      this.isScanning = false;
      console.log('Scan stopped manually');
    } catch (error) {
      console.error('Stop scan error:', error);
    }
  };

  getDiscoveredDevices = async (): Promise<Peripheral[]> => {
    try {
      const peripherals = await BleManager.getDiscoveredPeripherals();
      return peripherals;
    } catch (error) {
      console.error('Get devices error:', error);
      return [];
    }
  };

  connectToDevice = async (deviceId: string): Promise<boolean> => {
    try {
      await BleManager.connect(deviceId);
      this.connectedDevices.add(deviceId);
      console.log('Connected to device:', deviceId);

      const peripheralInfo = await BleManager.retrieveServices(deviceId);
      console.log('Device services:', peripheralInfo);

      return true;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  };

  disconnectFromDevice = async (deviceId: string): Promise<void> => {
    try {
      await BleManager.disconnect(deviceId);
      this.connectedDevices.delete(deviceId);
      console.log('Disconnected from device:', deviceId);
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  };

  readCharacteristic = async (
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string
  ): Promise<any> => {
    try {
      const data = await BleManager.read(deviceId, serviceUUID, characteristicUUID);
      return data;
    } catch (error) {
      console.error('Read characteristic error:', error);
      return null;
    }
  };

  writeCharacteristic = async (
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
    data: number[]
  ): Promise<boolean> => {
    try {
      await BleManager.write(deviceId, serviceUUID, characteristicUUID, data);
      return true;
    } catch (error) {
      console.error('Write characteristic error:', error);
      return false;
    }
  };

  startNotification = async (
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string
  ): Promise<boolean> => {
    try {
      await BleManager.startNotification(deviceId, serviceUUID, characteristicUUID);
      console.log('Notifications started for characteristic');
      return true;
    } catch (error) {
      console.error('Start notification error:', error);
      return false;
    }
  };

  isDeviceConnected = (deviceId: string): boolean => {
    return this.connectedDevices.has(deviceId);
  };

  getConnectedDevices = async (): Promise<string[]> => {
    try {
      const devices = await BleManager.getConnectedPeripherals([]);
      return devices.map((device) => device.id);
    } catch (error) {
      console.error('Get connected devices error:', error);
      return [];
    }
  };
}

export default new BLEService();
