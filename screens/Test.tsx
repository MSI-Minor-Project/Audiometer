import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Modal, Portal } from 'react-native-paper'
import { useIsHeadphonesConnected, isHeadphonesConnected, getDeviceType } from 'react-native-device-info';
import { Snackbar } from 'react-native-paper';
import { BleManager, Identifier } from "react-native-ble-plx"
import useBLE from '../useBLE';
import useBLE2 from "../useBLE2"
import { Audio } from 'expo-av';
import { increaseVolume, play1000hz, play100hz, play2000hz, play250hz, play4000hz, play8000hz, playSound, stopPlayingSound } from '../utils/sound';
import { trpc } from '../trpc/client';
import { auth } from '../firebase';
import { RootStack } from '../App';
import { useNavigation } from '@react-navigation/native';
// detect headphones using react-native-ble-plx

// const m = [
//     "../audio/100hz.mp3",
//     "../audio/250hz.mp3",
//     "../audio/500hz.mp3",
//     "../audio/1000hz.mp3",
//     "../audio/2000hz.mp3",
//     "../audio/4000hz.mp3",
//     "../audio/8000hz.mp3",
// ]

const m = {
    0: require("../audio/100hz.mp3"),
    1: require("../audio/250hz.mp3"),
    2: require("../audio/500hz.mp3"),
    3: require("../audio/1000hz.mp3"),
    4: require("../audio/2000hz.mp3"),
    5: require("../audio/4000hz.mp3"),
    6: require("../audio/8000hz.mp3"),
}

export default function Test() {

    const { loading, result } = useIsHeadphonesConnected(); // { loading: true, result: false}
    const [headphonesConnectted, setHeadphonesConnectted] = useState(false)
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [volumelevel, setVolumelevel] = useState(0.1);
    const [resolve, setResolve] = useState<Function | null>(null);
    const [reject, setReject] = useState<Function | null>(null);
    const { requestPermissions, searchForPeripherals, allDevices, connectToDevice, connectedDevice, disconnectFromDevice } = useBLE2();
    const user = auth.currentUser;
    const createTestResult = trpc.storeTest.mutate;
    const [frequency, setFrequency] = useState(0);
    const navigation = useNavigation<RootStack>();
    const [soundTrack, setSoundTrack] = useState(m[0]);
    const [counter, setCounter] = useState(0);
    const [visible, setVisible] = React.useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    function getRequireFn(key: string) {
        switch (key) {
            case "0":
                return require("../audio/100hz.mp3");
            case "1":
                return require("../audio/250hz.mp3");
            case "2":
                return require("../audio/500hz.mp3");
            case "3":
                return require("../audio/1000hz.mp3");
            case "4":
                return require("../audio/2000hz.mp3");
            case "5":
                return require("../audio/4000hz.mp3");
            case "6":
                return require("../audio/8000hz.mp3");
            default:
                return require("../audio/100hz.mp3");
        }
    }

    const playSound = async (soundTrack: typeof m[0], earPosition: "left" | "right") => {
        try {
            const { sound, status } = await Audio.Sound.createAsync(soundTrack, {
                shouldPlay: true,
                isLooping: true,
                audioPan: earPosition === "left" ? -1.0 : 1.0,
                androidImplementation: 'MediaPlayer',
                volume: 0.1
            });
            setSound(sound);
            return sound;
        } catch (error) {
            throw error;
        }
    }

    const startTest = async () => {
        // requestPermission((result) => {
        //     if (result) {
        //         scanForDevices();
        //         // if the device type connected is a headset
        //         if (getDeviceType() !== 'Handset') {
        //             return onToggleSnackBar()
        //         }
        //         setHeadphonesConnectted(result)
        //         console.log('Result ' + result)
        //     }
        // })
        // console.log("Test started");
        // const permissions = await requestPermissions();
        // console.log("Permissions: ", permissions);
        // if (permissions) {
        //     if (result) {
        //         searchForPeripherals();
        //         // scanForDevices();
        //         // if the device type connected is a headset
        //         if (getDeviceType() !== 'Handset') {
        //             return onToggleSnackBar()
        //         }
        //         setHeadphonesConnectted(result)
        //         console.log('Result ' + result)
        //     }
        setIsTestStarted(true);

        // start the test
        try {
            const sound = await playSound(soundTrack, "left");

            // await createTestResult({
            //     leftEar: [l1, l2, l3, l4, l5, l6, l7, l8],
            //     rightEar: [r1, r2, r3, r4, r5, r6, r7, r8],
            //     name: "Test 1",
            //     userId: user?.uid!,
            //     url: ""
            // })

            console.log('Test completed');

            // navigate to the result screen

            // navigation.navigate("Result");

        } catch (error) {
            // handle error of test could not be completed
            console.log("Error completing test: ", error);
        }

        // }
    }

    const completeTest = async (testFn: (earPosition: "left" | "right") => Promise<void>, frequency: number, earPosition: "left" | "right"): Promise<{
        frequency: number,
        decibel: number
    }> => {
        return new Promise(async (resolve, reject) => {
            try {
                setResolve(resolve);
                setReject(reject);
                setFrequency(frequency);
                setVolumelevel(0.1);
                await testFn(earPosition);
            } catch (error) {
                reject(error);
            }
        })
    }

    const playElevatorMusic = async () => {
        try {

            const { sound, status } = await Audio.Sound.createAsync(require("../assets/audio/Elevator-music.mp3"), {
                shouldPlay: true,
                isLooping: true,
                audioPan: -1.0,
                androidImplementation: 'MediaPlayer',
            });

            return sound;

        } catch (error) {
            console.log(`Error playing sound: ${error}`);
        }
    }

    const onPressCanthear = async () => {
        try {
            if (sound) {
                if (volumelevel < 1.0) {
                    increaseVolume(sound, volumelevel + 0.1);
                    setVolumelevel((volumelevel) => volumelevel + 0.1)
                } else {
                    // record the sound data and move onto next test
                    if (resolve) {
                        resolve(true);
                        console.log('Can hear at volume : ', volumelevel);
                        stopPlayingSound(sound);
                    }
                }
            }
        } catch (error) {
            if (reject) {
                reject(error);
            }
            console.log("Error playing sound (test1) : ", error);
        }
    }

    const onPressCanhear = async () => {
        try {
            // record the sound data and move onto next test
            if (sound !== null)
                stopPlayingSound(sound);
            counter < 7 ? setCounter(counter + 1) : setCounter(0);
            const num = counter as any;
            await sound?.stopAsync().then(() => {
                // setSoundTrack(getRequireFn(num.toString()));
                playSound(getRequireFn(num.toString()), "left");
                setVolumelevel(0.1);
            });
        } catch (error) {
            if (reject) {
                reject(error);
            }
            console.log("Error playing sound (test1) : ", error);
        }
    }

    const stopSound = async () => {
        try {
            if (sound !== null)
                stopPlayingSound(sound);
        } catch (error) {
            console.log("Error stopping sound: ", error);
        }
    }

    return (
        <View className='h-full'>
            <View className='flex flex-row items-center gap-x-5 mx-auto'>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full text-white' style={{
                    backgroundColor: counter === 0 ? "green" : "#5E32B3",
                }}>
                    <Text className='text-center text-white' style={{
                        color: counter === 1 ? "green" : "#5E32B3"
                    }}>1</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full text-white' style={{
                    backgroundColor: counter === 2 ? "green" : "#5E32B3"
                }}>
                    <Text className='text-center text-white'>2</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full text-white' style={{
                    backgroundColor: counter === 3 ? "green" : "#5E32B3"
                }}>
                    <Text className='text-center text-white'>3</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full text-white' style={{
                    backgroundColor: counter === 4 ? "green" : "#5E32B3"
                }}>
                    <Text className='text-center text-white'>4</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full text-white' style={{
                    backgroundColor: counter === 5 ? "green" : "#5E32B3"
                }}>
                    <Text className='text-center text-white'>5</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full text-white' style={{
                    backgroundColor: counter === 6 ? "green" : "#5E32B3"
                }}>
                    <Text className='text-center text-white'>6</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full text-white' style={{
                    backgroundColor: counter === 7 ? "green" : "#5E32B3"
                }}>
                    <Text className='text-center text-white'>7</Text>
                </View>
            </View>
            {/* Bottom section */}
            {!isTestStarted ?
                <View className='bg-[#5E32B3] rounded-md'>
                    <Button style={{
                        backgroundColor: "white",
                        borderRadius: 10,
                        width: "90%",
                        alignSelf: "center",
                        marginTop: 20,
                        marginBottom: 20
                    }} onPress={startTest}>
                        <Text className='text-purple-600 text-lg'>Start the test</Text>
                    </Button>
                </View>
                : <View className='flex flex-col gap-y-5'>
                    <View className='bg-[#5E32B3] rounded-md'>
                        <Button style={{
                            backgroundColor: "white",
                            borderRadius: 10,
                            width: "90%",
                            alignSelf: "center",
                            marginTop: 20,
                            marginBottom: 20
                        }} onPress={onPressCanhear}>
                            <Text className='text-green-600 text-lg'>I can year</Text>
                        </Button>
                    </View>
                    <View className='bg-[#5E32B3] rounded-md'>
                        <Button style={{
                            backgroundColor: "white",
                            borderRadius: 10,
                            width: "90%",
                            alignSelf: "center",
                            marginTop: 20,
                            marginBottom: 20
                        }} onPress={onPressCanthear}>
                            <Text className='text-red-600 text-lg'>I can't year</Text>
                        </Button>
                    </View>
                </View>
            }
            {
                allDevices.map((device) => (
                    <Text>{device.name}</Text>
                ))
            }
            <Text>Headphones conneted: {headphonesConnectted ? "Yes" : "No"}</Text>
            <Button>
                <Text>Connect to device</Text>
            </Button>
            <Portal>
                <Modal visible={visible} onDismiss={onDismissSnackBar} contentContainerStyle={{
                    width: "75%",
                    height: "30%",
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 20,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>
                    <Text className='text-xl font-bold'>Warning</Text>
                    <Text className='text-lg'>
                        To make the application fully functional, plug in the headset or headphones.
                        Using application without headset or headphones significantly limits its functions
                    </Text>
                </Modal>
            </Portal>
            <StatusBar style="dark" />
        </View>
    )
}