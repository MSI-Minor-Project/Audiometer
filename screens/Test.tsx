import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Modal, Portal } from 'react-native-paper'
import { useIsHeadphonesConnected } from 'react-native-device-info';
import { Snackbar } from 'react-native-paper';

export default function Test() {

    const { loading, result } = useIsHeadphonesConnected(); // { loading: true, result: false}

    const [visible, setVisible] = React.useState(false);

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    if (loading) {
        console.log('headphones loading')
    }

    if (result) {
        console.log('headphones connected')
    }

    const startTest = () => {
        if (!result) {
            onToggleSnackBar()
        }
    }

    return (
        <View>
            <View className='flex flex-row items-center gap-x-5 mx-auto'>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full'>
                    <Text className='text-center text-white'>1</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full'>
                    <Text className='text-center text-white'>2</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full'>
                    <Text className='text-center text-white'>3</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full'>
                    <Text className='text-center text-white'>4</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full'>
                    <Text className='text-center text-white'>5</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full'>
                    <Text className='text-center text-white'>6</Text>
                </View>
                <View className='bg-[#5E32B3] w-6 h-6 rounded-full'>
                    <Text className='text-center text-white'>7</Text>
                </View>
            </View>
            {/* Bottom section */}
            <View className='bg-[#5E32B3] rounded-md'>
                <Button style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    width: "90%",
                    alignSelf: "center",
                    marginTop: 20,
                    marginBottom: 20
                }} onPress={startTest}>
                    <Text className='text-purple-600'>Start the test</Text>
                </Button>
            </View>
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
            <StatusBar style="auto" />
        </View>
    )
}