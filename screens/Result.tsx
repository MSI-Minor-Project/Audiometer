import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dimensions } from "react-native";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStack } from '../App';
import { Button, ActivityIndicator, MD2Colors } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { VictoryChart, VictoryLine } from 'victory-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { trpc } from '../trpc/client';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const chartConfig = {
    backgroundGradientFrom: "#FFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};

const screenWidth = Dimensions.get("window").width;

export default function Result() {

    const navigation = useNavigation<StackNavigationProp<RootStack, "Result">>();
    const router = useRoute<RouteProp<RootStack, "Result">>();
    const [leftEar, setLeftEar] = useState<any>([]);
    const [rightEar, setRightEar] = useState<any>([]);

    // const { isLoading, error, isError, isSuccess, data: mapData } = trpc.getTest.useQuery({
    //     id: router.params.testId
    // },
    //     {
    //         enabled: !!router.params.testId,
    //         onSuccess(data) {
    //             setLeftEar(() => {
    //                 // @ts-ignore
    //                 return data!.leftEar.map((doc: any) => {
    //                     return {
    //                         x: doc.frequency,
    //                         y: doc.pitch
    //                     }
    //                 })
    //             })

    //         },
    //     })

    useEffect(() => {
        async function getData() {
            console.log(`test id = ${router.params.testId}`)
            const testDocRef = doc(db, "tests", router.params.testId);

            const testDoc = await getDoc(testDocRef);

            const data = {
                id: testDoc.id,
                ...testDoc.data()
            }
            // @ts-ignore
            setLeftEar(data.leftEar.map((doc: any) => {
                return {
                    x: doc.frequency,
                    y: doc.pitch * 10
                }
            }))

            // @ts-ignore
            setRightEar(data.rightEar.map((doc: any) => {
                return {
                    x: doc.frequency,
                    y: doc.pitch * 10
                }
            }))

            console.log(`left ear = ${leftEar}`)
        }
        getData();
    }, [router.params.testId])

    // if (isLoading) {
    //     return <View className='h-full flex flex-col items-center justify-center'>
    //         <ActivityIndicator animating={true} size="large" color={MD2Colors.red800} />
    //     </View>
    // }

    // if (isError) {
    //     return <Text className='text-red-500 text-lg'>{error.message}</Text>
    // }

    return (
        <View>
            {
                leftEar && rightEar && <VictoryChart
                    minDomain={{ x: 100, y: 10 }}
                    maxDomain={{ x: 8000, y: 70 }}
                >
                    <VictoryLine
                        style={{
                            data: { stroke: "#c43a31" },
                            parent: { border: "1px solid #ccc" }
                        }}
                        // @ts-ignore
                        data={
                            leftEar
                        }
                    />
                    {/* <VictoryLine
                        style={{
                            data: { stroke: "#c43a31" },
                            parent: { border: "1px solid #ccc" }
                        }}
                        // @ts-ignore
                        data={mapData!.rightEar.map((doc: any) => {
                            return {
                                x: doc.freqquency,
                                y: doc.pitch
                            }
                        })}
                    /> */}
                </VictoryChart>
            }
            <Button mode="contained" style={{
                marginLeft: 10,
                marginRight: 10
            }} onPress={() => navigation.navigate("App", {
                screen: "Home"
            })}>
                Go to home
            </Button>
            <StatusBar style="dark" />
        </View>
    )
}