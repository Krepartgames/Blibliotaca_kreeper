import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlicHydWTMNTchLiikJPc81OPCj1SyCL8",
  authDomain: "livros-da-biblioteca-kreeper.firebaseapp.com",
  projectId: "livros-da-biblioteca-kreeper",
  storageBucket: "livros-da-biblioteca-kreeper.appspot.com",
  messagingSenderId: "14768981666",
  appId: "1:14768981666:web:446a660d9669f0d487f9fb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);