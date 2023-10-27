import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";

export const register = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await emailVerification();
        const user = userCredential.user;
        console.log("User registered : ", user);
        return user;
    } catch (error) {
        throw error;
    }
}

export const emailVerification = async () => {

    const user = auth.currentUser;
    if (!user) throw new Error("User not found");

    try {
        await sendEmailVerification(user, {
            handleCodeInApp: true,
            url: "https://audiometer-a5519.firebaseapp.com",

        }).then(() => {

        })
    } catch (error: any) {
        const errrorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        throw error;
    }
}