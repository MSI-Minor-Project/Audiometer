import { View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Modal, Portal, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { Text } from "react-native-paper"
import { RootStack } from '../App'
import { StackNavigationProp } from '@react-navigation/stack'
import { register } from '../utils/auth'
import { FirebaseError } from 'firebase/app'
import { trpc } from '../trpc/client'

type StackProps = StackNavigationProp<RootStack, "Register">;

export default function RegisterScreen() {

    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const navigation = useNavigation<StackProps>();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const createUser = trpc.createUser.mutate;

    const handleRegistration = async () => {
        try {
            setLoading(true);
            const user = await register(email, password);
            if (user) {
                const id = user.uid;
                // save the user data in the postgresQL database
                await createUser({
                    email,
                    name: firstname + " " + lastname,
                    uid: id,
                });
                // navigate to the home screen
                // set loading to false
                setLoading(false);
            }
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                alert("Email already in use");
            } else if (error.code === "auth/weak-password") {
                alert("Password must be at least 6 characters");
            } else {
                alert("Signup error : " + error.message);
            }
        }
    }

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
            <TouchableOpacity onPress={handleRegistration}>
                <Button mode="contained-tonal" loading={loading}>
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