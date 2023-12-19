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
import { LineChart } from 'react-native-chart-kit';

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
// left ear is red and right ear is blue

const screenWidth = Dimensions.get("window").width;

const data = {
    labels: ["100hz", "250hz", "500hz", "1000hz", "4000hz", "8000hz"],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `#d62828`, // optional
            strokeWidth: 2 // optional
        }
    ],
    legend: ["Left ear"] // optional
};

const data2 = {
    labels: ["100hz", "250hz", "500hz", "1000hz", "4000hz", "8000hz"],
    datasets: [
        {
            data: [20, 45, 28, 80, 99, 43],
            color: (opacity = 1) => `#4361ee`, // optional
            strokeWidth: 2 // optional
        }
    ],
    legend: ["Right ear"] // optional
}

export default function Result() {

    const navigation = useNavigation<StackNavigationProp<RootStack, "Result">>();
    const router = useRoute<RouteProp<RootStack, "Result">>();
    const [leftEar, setLeftEar] = useState<{
        x: number, y: number
    }[]>([]);

    const [rightEar, setRightEar] = useState<{
        x: number, y: number
    }[]>([]);

    const [d1, setD1] = useState(
        {
            labels: ["100hz", "250hz", "500hz", "1000hz", "4000hz", "8000hz"],
            datasets: [
                {
                    data: [20, 45, 28, 80, 99, 43],
                    color: (opacity = 1) => `#d62828`, // optional
                    strokeWidth: 2 // optional
                }
            ],
            legend: ["Left ear"] // optional
        }
    )

    const [d2, setD2] = useState({
        labels: ["100hz", "250hz", "500hz", "1000hz", "4000hz", "8000hz"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `#4361ee`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["Right ear"] // optional
    })

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
            // console.log(`test id = ${router.params.testId}`)
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
                    y: doc.pitch * 100
                }
            }))

            // @ts-ignore
            const leftEarArray = data.leftEar.map((doc: any) => {
                return {
                    x: doc.frequency,
                    y: doc.pitch * 100
                }
            })

            // @ts-ignore
            setRightEar(data.rightEar.map((doc: any) => {
                return {
                    x: doc.frequency,
                    y: doc.pitch * 100
                }
            }))

            // @ts-ignore
            const rightEarData = data.rightEar.map((doc: any) => {
                return {
                    x: doc.frequency,
                    y: doc.pitch * 100
                }
            })

            console.log(`left ear = ${JSON.stringify(leftEarArray)}`);
            console.log(`right ear = ${JSON.stringify(rightEarData)}`);

            setD1((value) => (
                {
                    ...value,
                    datasets: [
                        {
                            ...value.datasets[0],
                            data: leftEarArray.map((val: any) => val.y)
                            // data: [30, 65, 18, 70, 99, 51]
                        }
                    ]
                }
            ))

            setD2((value) => (
                {
                    ...value,
                    datasets: [
                        {
                            ...value.datasets[0],
                            data: rightEarData.map((val: any) => val.y)
                            // data: [30, 65, 18, 70, 99, 51]
                        }
                    ]
                }
            ))

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
        <View className='h-full'>
            {
                leftEar && rightEar && <View className='flex flex-col items-center gap-y-6 mt-8'>
                    <LineChart
                        data={d1}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                    />
                    <LineChart
                        data={d2}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                    />
                </View>
            }
            <Button mode="contained" style={{
                marginLeft: 10,
                marginRight: 10,
                marginTop: "auto",
                marginBottom: 20
            }} onPress={() => navigation.navigate("App", {
                screen: "Home"
            })}>
                Go to home
            </Button>
            <StatusBar style="dark" />
        </View>
    )
}