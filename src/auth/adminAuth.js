// adminAuth.js — Robust client-side security with PBKDF2 hashing, rate limiting, and recovery key support

const ADMIN_KEY = "amaan_portfolio_admin_session";
const LOCKOUT_KEY = "amaan_admin_lockout";
const CREDS_KEY = "amaan_admin_creds";

const DEFAULT_RECOVERY_KEY = "AQ-2026-RECOVER";

const DEFAULT_CREDENTIALS = {
  username: "amaan",
  passwordChanged: false,
  recoveryKey: DEFAULT_RECOVERY_KEY,
};

// Cryptographically strong PBKDF2 hashing with 100,000 iterations
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

// Rate-limiting check
export function getLockoutState() {
  try {
    const lockoutData = JSON.parse(localStorage.getItem(LOCKOUT_KEY));
    if (lockoutData && lockoutData.lockedUntil > Date.now()) {
      const remainingSeconds = Math.ceil((lockoutData.lockedUntil - Date.now()) / 1000);
      return { isLocked: true, remainingSeconds, attempts: lockoutData.attempts };
    }
  } catch {}
  return { isLocked: false, remainingSeconds: 0, attempts: 0 };
}

function recordFailedAttempt() {
  try {
    const lockoutData = JSON.parse(localStorage.getItem(LOCKOUT_KEY)) || { attempts: 0, lockedUntil: 0 };
    const attempts = lockoutData.attempts + 1;

    let lockedUntil = 0;
    if (attempts >= 5) {
      // Lock out for 15 minutes after 5 failed attempts
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

export async function loginAdmin(username, password) {
  const lockout = getLockoutState();
  if (lockout.isLocked) {
    return {
      success: false,
      isLocked: true,
      remainingSeconds: lockout.remainingSeconds,
      error: `Too many failed attempts. Try again in ${Math.ceil(lockout.remainingSeconds / 60)} mins.`,
    };
  }

  const creds = getCredentials();
  const hash = await pbkdf2Hash(password);

  let isValid = false;
  let isDefaultPassword = false;

  if (username !== creds.username) {
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
      expires: Date.now() + 2 * 60 * 60 * 1000, // 2 hours expiry
      username,
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

// Reset password via Recovery Key
export async function recoverPassword(recoveryKeyInput, newPassword) {
  const creds = getCredentials();
  const targetRecoveryKey = creds.recoveryKey || DEFAULT_RECOVERY_KEY;

  if (recoveryKeyInput.trim() !== targetRecoveryKey.trim()) {
    return { success: false, error: "Invalid Recovery Key." };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "New password must be at least 8 characters long." };
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
  sessionStorage.removeItem(ADMIN_KEY);
}

export async function changePassword(currentPassword, newPassword, customRecoveryKey) {
  const creds = getCredentials();
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
