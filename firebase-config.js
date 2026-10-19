// Firebase setup – shared by the whole app
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiuiF1o2EYispsDbve4dOWqP5hiQyUw4o",
  authDomain: "event-management21.firebaseapp.com",
  projectId: "event-management21",
  storageBucket: "event-management21.firebasestorage.app",
  messagingSenderId: "249914735926",
  appId: "1:249914735926:web:bb4e75dc98b99ea41c0797"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/* ------------------------------------------------------------------
   ADMIN ACCOUNTS
   Anyone who signs up / logs in with one of these emails becomes an
   admin. Everybody else is a participant.
   ⚠ Change this to YOUR email, then sign up with it first.
   Also put the same email(s) in firestore.rules (isAdmin function).
------------------------------------------------------------------- */
export const ADMIN_EMAILS = ["admin@eventhub.com"];
