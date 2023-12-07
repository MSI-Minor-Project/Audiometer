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
import { StackNavigationProp } from '@react-navigation/stack';

type StackProps = StackNavigationProp<RootStack, "Test">;


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
    const { mutate: createTestResult, isError, isSuccess, data } = trpc.storeTest.useMutation({
        onSuccess(data, variables, context) {
            console.log('data after success test submission = ', data);
        },
        onError(error, variables, context) {
            console.log('Error occured while storing test = ', error);
        },
    });
    const [frequency, setFrequency] = useState(0);
    const navigation = useNavigation<StackProps>();
    const [soundTrack, setSoundTrack] = useState(m[0]);
    const [counter, setCounter] = useState(0);
    const [visible, setVisible] = React.useState(false);
    const [testType, setTestType] = useState("left");
    const onToggleSnackBar = () => setVisible(!visible);

    const [resultMap, setResultMap] = useState<Map<string, { frequency: number, pitch: number }> | null>(null)

    // const { data, error, isError: isErrorTest, isSuccess: isSuccessTest ,isLoading} = trpc.fetchStarWars.useQuery();

    // if (isErrorTest) {
    //     console.log("error occured while fetch from star wars api = " + error)
    // }

    // if (isSuccessTest) {
    //     console.log("Data from star wars api = " + JSON.stringify(data));
    // }

    // if(isLoading) {
    //     console.log("Fetching from star wars")
    // }

    function getFrequency(num: number) {
        switch (num) {
            case 0:
                return 100;
            case 1:
                return 250;
            case 2:
                return 500;
            case 3:
                return 1000;
            case 4:
                return 2000;
            case 5:
                return 4000;
            case 6:
                return 8000;
            default:
                return 100;
        }
    }

    const query = trpc.helloWorld.useQuery;

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
            if (testType === "left") {
                const sound = await playSound(soundTrack, "left");
            } else {
                const sound = await playSound(soundTrack, "right");
            }
            setCounter((count) => count + 1);
            console.log(counter);

            console.log('Test completed');

            // navigate to the result screen

            // navigation.navigate("Result");

        } catch (error) {
            // handle error of test could not be completed
            console.log("Error completing test: ", error);
        }

        // }
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

    const submitTestData = async () => {
        try {
            const larr = new Array<{
                frequency: number,
                decibel: number
            }>();

            for (let i = 0; i <= 6; i++) {
                larr.push({
                    frequency: getFrequency(i),
                    decibel: 0.1
                })
            }

            // console.log('result map = ' + resultMap);
            // if (resultMap !== null)
            //     resultMap.forEach((value, key) => {
            //         if (key.includes("left")) {
            //             larr.push({
            //                 frequency: value.frequency,
            //                 decibel: value.pitch
            //             })
            //         }
            //     });

            const rarr = new Array<{
                frequency: number,
                decibel: number
            }>();

            // if (resultMap !== null)

            //     resultMap.forEach((value, key) => {
            //         if (key.includes("right")) {
            //             rarr.push({
            //                 frequency: value.frequency,
            //                 decibel: value.pitch
            //             })
            //         }
            //     });

            for (let i = 0; i <= 6; i++) {
                rarr.push({
                    frequency: getFrequency(i),
                    decibel: 0.4
                })
            }

            console.log('left ear = ' + JSON.stringify(larr));
            console.log('right ear = ' + JSON.stringify(rarr));
            console.log('user id = ' + user?.uid);
            createTestResult({
                leftEar: larr,
                rightEar: rarr,
                name: "Test " + new Date().toDateString(),
                userId: user?.uid as string,
            })

            return navigation.navigate("Result", {
                testId: data!!
            });
        } catch (error) {
            console.log("Error submitting test data: ", error);
        }
    }

    const onPressCanhear = async () => {
        try {
            // record the sound data and move onto next test

            if (resultMap && resultMap.has(getFrequency(counter).toString() + testType) === false) {
                resultMap.set(getFrequency(counter).toString() + testType, {
                    frequency: getFrequency(counter),
                    pitch: volumelevel
                });
                setResultMap((m) => {
                    m!.set(getFrequency(counter).toString() + testType, {
                        frequency: getFrequency(counter),
                        pitch: volumelevel
                    });

                    return m;
                })
            } else if (resultMap === null) {
                setResultMap(() => {
                    const m = new Map();
                    m.set(getFrequency(counter).toString() + testType, {
                        frequency: getFrequency(counter),
                        pitch: volumelevel
                    });
                    return m;
                })
            }

            if (counter < 7) {
                setCounter((count) => count + 1);
            } else {
                if (testType === "right") {
                    await stopSound().then(async () => {
                        const larr = new Array<{
                            frequency: number,
                            decibel: number
                        }>();

                        for (let i = 0; i <= 6; i++) {
                            larr.push({
                                frequency: getFrequency(i),
                                decibel: 8 * i
                            })
                        }

                        // console.log('result map = ' + resultMap);
                        // if (resultMap !== null)
                        //     resultMap.forEach((value, key) => {
                        //         if (key.includes("left")) {
                        //             larr.push({
                        //                 frequency: value.frequency,
                        //                 decibel: value.pitch
                        //             })
                        //         }
                        //     });

                        const rarr = new Array<{
                            frequency: number,
                            decibel: number
                        }>();

                        // if (resultMap !== null)

                        //     resultMap.forEach((value, key) => {
                        //         if (key.includes("right")) {
                        //             rarr.push({
                        //                 frequency: value.frequency,
                        //                 decibel: value.pitch
                        //             })
                        //         }
                        //     });

                        for (let i = 0; i <= 6; i++) {
                            rarr.push({
                                frequency: getFrequency(i),
                                decibel: 10 * i
                            })
                        }

                        console.log('left ear = ' + JSON.stringify(larr));
                        console.log('right ear = ' + JSON.stringify(rarr));
                        console.log('user id = ' + user?.uid);
                        createTestResult({
                            leftEar: larr,
                            rightEar: rarr,
                            name: "Test " + new Date().toDateString(),
                            userId: user?.uid as string,
                        })
                    });

                    return navigation.navigate("Result", {
                        testId: data!!
                    });
                } else {
                    setTestType("right");
                    await stopSound();
                    setCounter(0);
                }
            }
            console.log("counter : ", counter)
            const num = counter as any;
            await sound?.stopAsync().then(() => {
                // setSoundTrack(getRequireFn(num.toString()));
                if (testType === "left")
                    playSound(getRequireFn(num.toString()), "left");
                else
                    playSound(getRequireFn(num.toString()), "right");
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
                    backgroundColor: counter === 1 ? "green" : "#5E32B3",
                }}>
                    <Text className='text-center text-white'>1</Text>
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
            <Button onPress={submitTestData}>
                <Text>Submit test data</Text>
            </Button>
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