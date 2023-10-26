import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Button, Card, Text, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {

    const [text, setText] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const navigation = useNavigation();

    return <SafeAreaView>
        <View className='flex flex-col justify-center items-center h-full'>
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
                    }}>
                        <Button mode="contained-tonal">
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