import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Text } from "react-native-paper"

export default function RegisterScreen() {

    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const navigation = useNavigation();

    return (
        <View style={{
            rowGap: 10,
            padding: 10
        }}>
            <TextInput
                label="First Name"
                value={firstname}
                onChangeText={text => setFirstname(text)}
                mode="outlined"
            />
            <TextInput
                label="Last Name"
                value={lastname}
                onChangeText={text => setLastname(text)}
                mode="outlined"
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                mode="outlined"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                mode="outlined"
                secureTextEntry={secureTextEntry}
                right={
                    <TextInput.Icon icon="eye" onPress={() => {
                        setSecureTextEntry(!secureTextEntry);
                    }} />
                }
            />
            <TouchableOpacity>
                <Button mode="contained-tonal">
                    Register
                </Button>
            </TouchableOpacity>
            <View style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                rowGap: 7,
                justifyContent: "center",
            }}>
                <Text variant='bodyLarge'>Do have an account? </Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Login");
                }}>
                    <Text variant='bodyLarge' style={{
                        color: "purple"
                    }}>
                        Login here
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}