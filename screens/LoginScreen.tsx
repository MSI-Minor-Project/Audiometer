import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Card, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStack } from '../App';
import { signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { emailVerification } from '../utils/auth';

type StackProps = StackNavigationProp<RootStack, "Login">;

export default function LoginScreen() {

    const [text, setText] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const navigation = useNavigation<StackProps>();
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [setshowEmailMessage, setSetshowEmailMessage] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };


    const handleSignin = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, text, password);
            const user = userCredentials.user;
            setIsLoading(true);
            if (user) {
                if (!user.emailVerified) {
                    setSetshowEmailMessage(true);
                    await emailVerification();
                    await auth.signOut();
                    setIsLoading(false);
                }
            }
        } catch (error: any) {
            setIsLoading(false);
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                alert("User not found or wrong password");
            } else if (error.code === "auth/too-many-requests") {
                alert("Too many unsuccessful login attempts. Try again later");
            } else {
                alert("Signin error : " + error.message);
            }
        }
    }

    return <SafeAreaView>
        <View className='flex flex-col justify-center items-center h-full'>
            {setshowEmailMessage ? <Text variant='bodyLarge'>Email verification required. Please check your email inbox and follow the instuctions to verify your email address</Text> : null}
            <Card mode='elevated' style={{
                padding: 10,
            }}>
                <Card.Content style={{
                    rowGap: 7,
                }}>
                    <TextInput
                        mode="outlined"
                        label="Email"
                        value={text}
                        onChangeText={text => setText(text)}
                    />
                    <TextInput
                        mode="outlined"
                        label="Enter Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={secureTextEntry}
                        caretHidden={true}
                        right={
                            <TextInput.Icon icon="eye" onPress={() => {
                                setSecureTextEntry(!secureTextEntry);
                            }} />
                        }
                    />
                </Card.Content>
                <Card.Actions style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <TouchableOpacity style={{
                        width: "100%",
                    }} onPress={handleSignin}>
                        <Button mode="contained-tonal" loading={isLoading}>
                            Login
                        </Button>
                    </TouchableOpacity>
                </Card.Actions>
                <Card.Content style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    rowGap: 7,
                    justifyContent: "center",
                }}>
                    <Text variant='bodyLarge'>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text variant='bodyLarge' style={{ color: "purple" }}>
                            Register here
                        </Text>
                    </TouchableOpacity>
                </Card.Content>
            </Card>
        </View>
    </SafeAreaView>
}