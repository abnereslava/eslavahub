import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth, googleProvider } from "../config/firebase.js";

async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

async function signOutCurrentUser() {
  return signOut(auth);
}

function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export {
  observeAuthState,
  signInWithGoogle,
  signOutCurrentUser
};
