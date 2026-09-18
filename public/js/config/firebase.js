import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// Firebase Web configuration is client-side configuration, not an admin credential.
const firebaseConfig = {
  apiKey: "AIzaSyBddU6oe5Q0DEu_0RfVK0brMH5NIqgh4_o",
  authDomain: "eslavahub-434e5.firebaseapp.com",
  projectId: "eslavahub-434e5",
  storageBucket: "eslavahub-434e5.firebasestorage.app",
  messagingSenderId: "154251333316",
  appId: "1:154251333316:web:7bae1f03d2e2d6b0cc4391"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

export { app, auth, db, googleProvider };
