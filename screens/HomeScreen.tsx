import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Divider, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootStack } from '../App';
import { StackNavigationProp } from '@react-navigation/stack';

type StackProps = StackNavigationProp<RootStack, "Test">;

export default function HomeScreen() {

    const navigation = useNavigation<StackProps>();

    return <View className='flex flex-col items-center justify-between p-7 h-full'>
        <View className='flex flex-col items-center gap-y-1'>
            <Ionicons name="md-information-circle" size={42} color="black" />
            <Text className='text-black text-lg'>Watch the condition of your hearing!</Text>
            <Text className='text-black text-lg'>Tone audiometry method is used for the test.</Text>
        </View>
        <Divider bold={true} style={{
            width: "100%",
            height: 3,
            borderColor: 'black',
            backgroundColor: 'black',
        }} />
        <View className='flex flex-col items-center gap-y-2'>
            <TouchableOpacity onPress={() => {
                navigation.navigate("Test");
            }} >
                <AntDesign name="pluscircleo" size={150} color="black" />
            </TouchableOpacity>
            <Text className='font-bold text-lg'>Press to start the test</Text>
        </View>
    </View>
}