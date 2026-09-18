import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth, googleProvider } from "../config/firebase.js";

const ALLOWED_USER_UIDS = Object.freeze([
  "056LHaaeFKYeqYCvNRUwbmww8AH3",
  "sGuYhgdQswdtlhCTTfizJQDhNiF3"
]);

const allowedUserUids = new Set(ALLOWED_USER_UIDS);

function isAuthorizedUser(user) {
  return Boolean(user?.uid && allowedUserUids.has(user.uid));
}

function createUnauthorizedError() {
  const error = new Error("Esta conta Google não está autorizada a acessar o EslavaHub.");
  error.code = "auth/not-authorized";
  return error;
}

async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);

  if (!isAuthorizedUser(result.user)) {
    await signOut(auth);
    throw createUnauthorizedError();
  }

  return result;
}

async function signOutCurrentUser() {
  return signOut(auth);
}

function observeAuthState(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user && !isAuthorizedUser(user)) {
      try {
        await signOut(auth);
      } finally {
        callback(null);
      }
      return;
    }

    callback(user);
  });
}

export {
  ALLOWED_USER_UIDS,
  isAuthorizedUser,
  observeAuthState,
  signInWithGoogle,
  signOutCurrentUser
};
