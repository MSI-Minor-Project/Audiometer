import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { auth } from '../firebase'

export default function Settings() {
    return (
        <View>
            <TouchableOpacity onPress={() => {
                auth.signOut();
            }}>
                <Button mode="outlined">
                    Signout
                </Button>
            </TouchableOpacity>
        </View>
    )
}