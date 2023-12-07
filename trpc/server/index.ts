import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { prisma } from '../../prisma/prisma';
import { TRPCError } from '@trpc/server';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { db } from '../../firebase';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

const appRouter = router({
    createUser: publicProcedure.input(z.object({
        name: z.string(),
        uid: z.string(),
        email: z.string().email(),
    })).mutation(async ({ input }) => {
        try {
            console.log('creating user');

            const user = await prisma.user.create({
                data: {
                    name: input.name,
                    uid: input.uid,
                    email: input.email,
                },
            });

            return user;
        } catch (error) {

            console.log("Error while creating user = ", error)

            if (error instanceof TRPCError) {
                console.log("TRPC Error occured")
                return error.message;
            }

            if (error instanceof FirebaseError) {
                return error.message;
            }

            if (error instanceof Error) {
                return error.message;
            }
        }
    }),
    storeTest: publicProcedure.input(z.object({
        name: z.string(),
        leftEar: z.array(z.object({
            frequency: z.number(),
            decibel: z.number(),
        })),
        rightEar: z.array(z.object({
            frequency: z.number(),
            decibel: z.number(),
        })),
        userId: z.string(),
    })).mutation(async ({ input }) => {
        try {
            console.log("StoreTest RPC function");

            const leftEar = input.leftEar.map((item) => {
                return {
                    frequency: item.frequency,
                    pitch: item.decibel,
                };
            });

            const rightEar = input.rightEar.map((item) => {
                return {
                    frequency: item.frequency,
                    pitch: item.decibel,
                };
            });

            const testDocRef = collection(db, "tests");

            const testDoc = await addDoc(testDocRef, {
                userId: input.userId, // acts as a primary key
                leftEar,
                rightEar,
            }).then((doc) => {
                return doc.id;
            })

        } catch (error) {

            if (error instanceof TRPCError) {
                return error.message;
            }

            if (error instanceof FirebaseError) {
                return error.message;
            }

            if (error instanceof Error) {
                return error.message;
            }
        }
    }),
    helloWorld: publicProcedure.input(z.object({
        name: z.string(),
    })).query(async ({ input }) => {
        return `Hello ${input.name}`;
    }),
    getTest: publicProcedure.input(z.object({
        id: z.string(),
    })).query(async ({ input }) => {
        try {
            // const test = await prisma.test.findUnique({
            //     where: {
            //         id: input.id,
            //     },
            //     include: {
            //         leftEar: true,
            //         rightEar: true,
            //     },
            // });
            console.log("Getting test")
            const testDocRef = doc(db, "tests", input.id);

            const testDoc = await getDoc(testDocRef);

            const data = {
                id: testDoc.id,
                ...testDoc.data()
            }
            console.log(`Test data = ` + data)
            return data;
        } catch (error) {

            if (error instanceof TRPCError) {
                return error.message;
            }

            if (error instanceof FirebaseError) {
                return error.message;
            }

            if (error instanceof Error) {
                return error.message;
            }
        }
    }),
    getAllTestOfUser: publicProcedure.input(z.object({
        userId: z.string(),
    })).query(async ({ input }) => {
        try {
            // const tests = await prisma.test.findMany({
            //     where: {
            //         user: {
            //             id: input.userId
            //         }
            //     },
            //     include: {
            //         leftEar: true,
            //         rightEar: true,
            //     },
            // });

            const testCollectionDocRef = collection(db, "tests");

            const q = query(testCollectionDocRef, where("userId", "==", input.userId));

            const tests = await getDocs(q);
            const data = tests.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            return data;
        } catch (error) {

            if (error instanceof TRPCError) {
                return error.message;
            }

            if (error instanceof PrismaClientValidationError) {
                return error.message;
            }

            if (error instanceof Error) {
                return error.message;
            }
        }
    }),
    fetchStarWars: publicProcedure.query(async () => {
        try {
            const q1 = await fetch("https://swapi.dev/api/people/1");
            const data = await q1.json();
            return data;
        } catch (error) {
            if (error instanceof TRPCError) {
                return error.message;
            }

            if (error instanceof Error) {
                return error.message;
            }
        }
    })
})
// Export type router type signature,
// NOT the router itself.

const server = createHTTPServer({
    router: appRouter,
});

server.listen(3000);
console.log('listening on 3000')
export type AppRouter = typeof appRouter;
