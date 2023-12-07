import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";

type PermissionCallback = (result: boolean) => void;

interface BluetoothLowEnergyApi {
    requestPermission: (callback: PermissionCallback) => void;
    scanForDevices: () => void;
    allDevices: Device[];
}

const bleManager = new BleManager();

export default function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([]);

    const requestPermission = async (callback: PermissionCallback) => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            callback(granted === PermissionsAndroid.RESULTS.GRANTED);
        } else {
            callback(true);
        }
    };

    const isDuplicate = (device: Device) => {
        return allDevices.some((d) => d.id === device.id);
    };

    const scanForDevices = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }

            if (device && device.name?.includes("boAt")) {
                setAllDevices((prev) => {
                    if (isDuplicate(device)) {
                        return prev;
                    }
                    return [...prev, device];
                });
            }
        });
    }

    return {
        requestPermission,
        scanForDevices,
        allDevices,
    };
}