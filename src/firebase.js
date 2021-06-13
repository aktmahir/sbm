import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAAV3f1s0_wVgWIMkeQ8IX6iyCZFjBM9lg",
  authDomain: "serbirmakina-3bbe1.firebaseapp.com",
  databaseURL: "https://serbirmakina-3bbe1.firebaseio.com",
  projectId: "serbirmakina-3bbe1",
  storageBucket: "serbirmakina-3bbe1.appspot.com",
  messagingSenderId: "528486177203",
  appId: "1:528486177203:web:8f2351662e0e4964f6d3c6",
  measurementId: "G-SKJ961JWD8",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
