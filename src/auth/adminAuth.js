// adminAuth.js — Multi-device Auth via Firebase Auth (or fallback to PBKDF2 local hashing)
import { auth, isConfigured } from "../firebase";
import {
  signInWithEmailAndPassword,
  updatePassword as fbUpdatePassword,
  signOut as fbSignOut,
} from "firebase/auth";

const ADMIN_KEY = "amaan_portfolio_admin_session";
const LOCKOUT_KEY = "amaan_admin_lockout";
const CREDS_KEY = "amaan_admin_creds";
const DEFAULT_RECOVERY_KEY = "AQ-2026-RECOVER";

const DEFAULT_CREDENTIALS = {
  username: "amaan",
  email: "amaanqasim000@gmail.com",
  passwordChanged: false,
  recoveryKey: DEFAULT_RECOVERY_KEY,
};

async function pbkdf2Hash(password, salt = "amaan_salt_portfolio_2026") {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getCredentials() {
  try {
    const stored = localStorage.getItem(CREDS_KEY);
    if (stored) {
      return { ...DEFAULT_CREDENTIALS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_CREDENTIALS;
}

function saveCredentials(creds) {
  localStorage.setItem(CREDS_KEY, JSON.stringify(creds));
}

export function getLockoutState() {
  try {
    const lockoutData = JSON.parse(localStorage.getItem(LOCKOUT_KEY));
    if (lockoutData && lockoutData.lockedUntil > Date.now()) {
      const remainingSeconds = Math.ceil(
        (lockoutData.lockedUntil - Date.now()) / 1000
      );
      return { isLocked: true, remainingSeconds, attempts: lockoutData.attempts };
    }
  } catch {}
  return { isLocked: false, remainingSeconds: 0, attempts: 0 };
}

function recordFailedAttempt() {
  try {
    const lockoutData = JSON.parse(localStorage.getItem(LOCKOUT_KEY)) || {
      attempts: 0,
      lockedUntil: 0,
    };
    const attempts = lockoutData.attempts + 1;
    let lockedUntil = 0;
    if (attempts >= 5) {
      lockedUntil = Date.now() + 15 * 60 * 1000;
    }
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ attempts, lockedUntil }));
    return { attempts, isLocked: attempts >= 5, remainingSeconds: 15 * 60 };
  } catch (e) {
    return { attempts: 1, isLocked: false, remainingSeconds: 0 };
  }
}

function resetFailedAttempts() {
  localStorage.removeItem(LOCKOUT_KEY);
}

export async function loginAdmin(usernameOrEmail, password) {
  const lockout = getLockoutState();
  if (lockout.isLocked) {
    return {
      success: false,
      isLocked: true,
      remainingSeconds: lockout.remainingSeconds,
      error: `Too many failed attempts. Try again in ${Math.ceil(
        lockout.remainingSeconds / 60
      )} mins.`,
    };
  }

  // 1. Firebase Auth Mode (Syncs across devices)
  if (isConfigured && auth) {
    try {
      // If user passed username, map to default email if needed
      const emailToUse = usernameOrEmail.includes("@")
        ? usernameOrEmail
        : "amaanqasim000@gmail.com";

      const userCred = await signInWithEmailAndPassword(auth, emailToUse, password);
      resetFailedAttempts();
      const session = {
        token: userCred.user.uid,
        expires: Date.now() + 2 * 60 * 60 * 1000,
        username: emailToUse,
        isFirebase: true,
      };
      sessionStorage.setItem(ADMIN_KEY, JSON.stringify(session));
      return { success: true, isDefaultPassword: false };
    } catch (fbError) {
      console.warn("Firebase Auth attempt failed:", fbError.message);
      const failedState = recordFailedAttempt();
      return {
        success: false,
        error:
          fbError.code === "auth/invalid-credential" || fbError.code === "auth/wrong-password"
            ? `Invalid credentials. (${5 - failedState.attempts} attempt(s) remaining)`
            : fbError.message,
      };
    }
  }

  // 2. Local Fallback Mode
  const creds = getCredentials();
  const hash = await pbkdf2Hash(password);

  let isValid = false;
  let isDefaultPassword = false;

  if (
    usernameOrEmail !== creds.username &&
    usernameOrEmail !== creds.email
  ) {
    recordFailedAttempt();
    return { success: false, error: "Invalid username or password." };
  }

  if (creds.passwordChanged && creds.passwordHash) {
    isValid = hash === creds.passwordHash;
  } else {
    const defaultHash = await pbkdf2Hash("aq@admin2024");
    isValid = hash === defaultHash;
    isDefaultPassword = isValid;
  }

  if (isValid) {
    resetFailedAttempts();
    const sessionToken = generateSessionToken();
    const session = {
      token: sessionToken,
      expires: Date.now() + 2 * 60 * 60 * 1000,
      username: usernameOrEmail,
    };
    sessionStorage.setItem(ADMIN_KEY, JSON.stringify(session));
    return { success: true, isDefaultPassword };
  }

  const failedState = recordFailedAttempt();
  return {
    success: false,
    error: failedState.isLocked
      ? "Account locked due to 5 failed attempts. Please wait 15 minutes or use Recovery Key."
      : `Invalid credentials. (${5 - failedState.attempts} attempt(s) remaining)`,
  };
}

export async function recoverPassword(recoveryKeyInput, newPassword) {
  const creds = getCredentials();
  const targetRecoveryKey = creds.recoveryKey || DEFAULT_RECOVERY_KEY;

  if (recoveryKeyInput.trim() !== targetRecoveryKey.trim()) {
    return { success: false, error: "Invalid Recovery Key." };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
  }

  // Firebase update if logged in
  if (isConfigured && auth && auth.currentUser) {
    try {
      await fbUpdatePassword(auth.currentUser, newPassword);
    } catch (e) {
      console.warn("Firebase password update error:", e);
    }
  }

  const newHash = await pbkdf2Hash(newPassword);
  saveCredentials({
    ...creds,
    passwordHash: newHash,
    passwordChanged: true,
  });

  resetFailedAttempts();
  return { success: true };
}

export function isAdminAuthenticated() {
  try {
    const session = JSON.parse(sessionStorage.getItem(ADMIN_KEY));
    if (session && session.expires > Date.now()) {
      return true;
    }
    sessionStorage.removeItem(ADMIN_KEY);
  } catch {}
  return false;
}

export function logoutAdmin() {
  if (isConfigured && auth) {
    fbSignOut(auth).catch(() => {});
  }
  sessionStorage.removeItem(ADMIN_KEY);
}

export async function changePassword(currentPassword, newPassword, customRecoveryKey) {
  const creds = getCredentials();

  // If using Firebase Auth and user is logged in
  if (isConfigured && auth && auth.currentUser) {
    try {
      await fbUpdatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        return {
          success: false,
          error: "Please log out and log back in to update your password.",
        };
      }
      return { success: false, error: err.message };
    }
  }

  // Local fallback password change
  const currentHash = await pbkdf2Hash(currentPassword);
  let currentIsValid = false;
  if (creds.passwordChanged && creds.passwordHash) {
    currentIsValid = currentHash === creds.passwordHash;
  } else {
    const defaultHash = await pbkdf2Hash("aq@admin2024");
    currentIsValid = currentHash === defaultHash;
  }

  if (currentIsValid) {
    const newHash = await pbkdf2Hash(newPassword);
    const updatedCreds = {
      ...creds,
      passwordHash: newHash,
      passwordChanged: true,
    };
    if (customRecoveryKey && customRecoveryKey.trim().length >= 6) {
      updatedCreds.recoveryKey = customRecoveryKey.trim();
    }
    saveCredentials(updatedCreds);
    return { success: true };
  }
  return { success: false, error: "Current password is incorrect." };
}

function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}
