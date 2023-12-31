import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { RootStack } from '../App'
import { StackNavigationProp } from '@react-navigation/stack'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { StatusBar } from 'expo-status-bar'
type StackProps = StackNavigationProp<RootStack, "Start">;

export default function StartScreen() {

    const navigation = useNavigation<StackProps>();

    return (
        <SafeAreaView>
            <View style={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
                padding: 20,
                rowGap: 10
            }}>
                <Text>{auth.currentUser?.email}</Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Register");
                }}>
                    <Button mode="contained" >
                        <Text className='text-lg' >Register</Text>
                    </Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Button mode="contained">
                        <Text className='text-lg' >Login</Text>
                    </Button>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Button mode="outlined">
                        <Text className='text-lg'>Continue as guest</Text>
                    </Button>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => { await signOut(auth) }}>
                    <Button mode="outlined">
                        <Text className='text-lg'>Sign out</Text>
                    </Button>
                </TouchableOpacity>
            </View>
            <StatusBar style='dark' />
        </SafeAreaView>
    )
}