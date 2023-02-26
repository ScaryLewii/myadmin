import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

export const firebaseConfig = {
    apiKey: "AIzaSyDW5FADyJt0u9FkuWnZvjKxX_k_Fv3LcTA",
    authDomain: "mybeauty-f5b84.firebaseapp.com",
    projectId: "mybeauty-f5b84",
    storageBucket: "mybeauty-f5b84.appspot.com",
    messagingSenderId: "604291702599",
    appId: "1:604291702599:web:c5bfdcf339e11b568c7662",
    measurementId: "G-L23SB7V3LZ"
};

const initFirebase = initializeApp( firebaseConfig );
const db = getFirestore( initFirebase )

export { db }