import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// CONFIG DO TEU FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDG44wGTJtdINCaVFCFxRJsninm-KwRTDI",
  authDomain: "localwabapp.firebaseapp.com",
  projectId: "localwabapp",
  storageBucket: "localwabapp.firebasestorage.app",
  messagingSenderId: "61456899292",
  appId: "1:61456899292:web:3f4dc071bcf74471ed2819"
};

// INICIALIZAR
const app = initializeApp(firebaseConfig);

// EXPORTAR
export const auth = getAuth(app);
export const db = getFirestore(app);