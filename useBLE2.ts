import { PermissionsAndroid, Platform } from "react-native";
import { useMemo, useState } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";

import {
    BleError,
    Characteristic,
} from "react-native-ble-plx";

interface BluetoothLowEnergyApi {
    requestPermissions(): Promise<boolean>;
    searchForPeripherals(): void;
    allDevices: Device[];
    connectToDevice: (device: Device) => Promise<void>;
    connectedDevice: Device | null;
    disconnectFromDevice: () => void;
}

export default function useBLE(): BluetoothLowEnergyApi {
    const bleManager = useMemo(() => new BleManager(), []);

    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const requestAndroid31Permissions = async () => {
        const bluetoothScanPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, {
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
            title: 'Bluetooth Scan Permission',
            message: 'This app requires bluetooth scan permission',
        });

        const bluetoothConnectPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, {
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
            title: 'Bluetooth Connect Permission',
            message: 'This app requires bluetooth connect permission',
        });

        const bluetoothFineLocationPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
            title: 'Bluetooth Fine Location Permission',
            message: 'This app requires bluetooth fine location permission',
        });

        return (bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            bluetoothFineLocationPermission === "granted"
        )
    }

    const requestPermissions = async () => {
        if (Platform.OS === "android") {
            if ((ExpoDevice.osVersion ?? -1) < "31") {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    buttonPositive: 'OK',
                    buttonNegative: 'Cancel',
                    title: 'Bluetooth Fine Location Permission',
                    message: 'This app requires bluetooth fine location permission',
                });
                return granted === PermissionsAndroid.RESULTS.GRANTED;

            } else {
                const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
                return isAndroid31PermissionsGranted;
            }
        } else return true;
    }

    const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex((device) => nextDevice.id === device.id) > -1;

    const scanForPeripherals = () =>
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device && device.name?.includes("boAt")) {
                setAllDevices((prevState: Device[]) => {
                    if (!isDuplicteDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        });

    const connectToDevice = async (device: Device) => {
        try {
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            // startStreamingData(deviceConnection);
        } catch (e) {
            console.log("FAILED TO CONNECT", e);
        }
    };

    const disconnectFromDevice = () => {
        if (connectedDevice) {
            bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
            // setHeartRate(0);
        }
    };


    return {
        requestPermissions,
        searchForPeripherals: scanForPeripherals,
        allDevices,
        connectedDevice,
        connectToDevice,
        disconnectFromDevice,
    }

}

