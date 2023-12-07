import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { RootStack } from '../App';
import { trpc } from '../trpc/client';
import { auth } from '../firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { ActivityIndicator, Button, List, MD2Colors } from 'react-native-paper';
import { signOut } from 'firebase/auth';

type StackProps = StackNavigationProp<RootStack, "Start">;

export default function Tests() {

    const navigation = useNavigation<StackProps>();
    const user = auth.currentUser;

    if (!user) {
        return null;
    }

    const { data, error, isError, isSuccess, isLoading } = trpc.getAllTestOfUser.useQuery({
        userId: user.uid !== null ? user.uid : ""
    }, {
        refetchInterval: 5000,
    });

    if (isLoading) {
        return <View className='h-full flex flex-col items-center justify-center'>
            <ActivityIndicator animating={true} size="large" color={MD2Colors.red800} />
        </View>
    }

    if (isSuccess) {
        console.log(data);
    }


    function checkAnswerType(d: typeof data) {
        if (d !== undefined) {
            if (d instanceof String) {
                return null;
            } else return d;
        } else return undefined;
    }

    function getJSX() {
        const d = checkAnswerType(data);
        if (d !== undefined && d !== null && typeof d !== "string") {
            return (
                d.map((item, index) => {
                    return (
                        <TouchableOpacity key={item.id} onPress={() => {
                            navigation.navigate("Result", { testId: item.id })
                        }}>
                            <View className='w-11/12 p-2 m-1 border-2 rounded-lg'>
                                <Text>{`Test no ${index + 1}`}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })
            )
        } else return null;
    }

    return (
        <ScrollView className='p-3'>
            {
                getJSX()
            }
        </ScrollView>
    )
}