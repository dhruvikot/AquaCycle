import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDVRHGzH_2DcIaL-4rZZiLhB0PxYIE9E3s",
    authDomain: "obrapadrecacho.firebaseapp.com",
    projectId: "obrapadrecacho",
    storageBucket: "obrapadrecacho.firebasestorage.app",
    messagingSenderId: "175915652954",
    appId: "1:175915652954:web:fe5b3c560dad4b9cfec563"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);