import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// Use keys compatible with SecureStore: only alphanumeric, '.', '-', '_'
const ENABLED_KEY = 'biometric_enabled';
const CREDENTIALS_KEY = 'biometric_credentials';
// Legacy keys (previous, invalid format) - support migration
const LEGACY_ENABLED_KEY = '@biometric_enabled';
const LEGACY_CREDENTIALS_KEY = '@biometric_credentials';

async function migrateLegacyKeysIfNeeded(): Promise<void> {
  try {
    // If new key exists, nothing to do
    const newEnabled = await SecureStore.getItemAsync(ENABLED_KEY);
    if (newEnabled !== null) return;

    // If legacy enabled exists, migrate it
    const legacyEnabled = await SecureStore.getItemAsync(LEGACY_ENABLED_KEY);
    if (legacyEnabled !== null) {
      console.log('Migrating legacy biometric enabled flag to new key');
      await SecureStore.setItemAsync(ENABLED_KEY, legacyEnabled);
      try {
        await SecureStore.deleteItemAsync(LEGACY_ENABLED_KEY);
      } catch (e) {
        // ignore
      }
    }

    // Migrate credentials if present under legacy key
    const legacyCreds = await SecureStore.getItemAsync(LEGACY_CREDENTIALS_KEY);
    if (legacyCreds !== null) {
      console.log('Migrating legacy biometric credentials to new key');
      await SecureStore.setItemAsync(CREDENTIALS_KEY, legacyCreds);
      try {
        await SecureStore.deleteItemAsync(LEGACY_CREDENTIALS_KEY);
      } catch (e) {
        // ignore
      }
    }
  } catch (error) {
    // migration failure should not crash the app
    console.warn('Error migrating legacy biometric keys:', error);
  }
}

export async function isBiometricSupported(): Promise<boolean> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  } catch (error) {
    console.warn('Error checking biometric support:', error);
    return false;
  }
}

export async function authenticateBiometric(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
      fallbackLabel: 'Use password',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch (error) {
    console.warn('Error during biometric authentication:', error);
    return false;
  }
}

export async function saveCredentials(email: string, password: string): Promise<void> {
  try {
    const payload = JSON.stringify({ email, password });
    // Ensure any legacy keys are migrated away first
    await migrateLegacyKeysIfNeeded();
    // Store credentials securely
    console.log('Saving biometric credentials for', email);
    await SecureStore.setItemAsync(CREDENTIALS_KEY, payload);
    console.log('Setting biometric enabled flag');
    await SecureStore.setItemAsync(ENABLED_KEY, 'true');
  } catch (error) {
    console.error('Error saving biometric credentials:', error);
    throw error;
  }
}

export async function getSavedCredentials(): Promise<{ email: string; password: string } | null> {
  try {
    // Migrate legacy keys first if needed
    await migrateLegacyKeysIfNeeded();

    const value = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    console.log('getSavedCredentials ->', !!value);
    if (!value) return null;
    return JSON.parse(value) as { email: string; password: string };
  } catch (error) {
    console.error('Error reading biometric credentials:', error);
    return null;
  }
}

export async function removeCredentials(): Promise<void> {
  try {
    console.log('Removing biometric credentials (both new and legacy keys)');
    // Delete both new and legacy keys to be safe
    try {
      await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
    } catch (e) {
      // ignore
    }
    try {
      await SecureStore.deleteItemAsync(ENABLED_KEY);
    } catch (e) {
      // ignore
    }
    try {
      await SecureStore.deleteItemAsync(LEGACY_CREDENTIALS_KEY);
    } catch (e) {
      // ignore
    }
    try {
      await SecureStore.deleteItemAsync(LEGACY_ENABLED_KEY);
    } catch (e) {
      // ignore
    }
  } catch (error) {
    console.error('Error removing biometric credentials:', error);
  }
}

export async function isBiometricEnabled(): Promise<boolean> {
  try {
    // Migrate legacy keys if present
    await migrateLegacyKeysIfNeeded();
    const v = await SecureStore.getItemAsync(ENABLED_KEY);
    console.log('isBiometricEnabled ->', v);
    return v === 'true';
  } catch (error) {
    console.warn('Error checking if biometric is enabled:', error);
    return false;
  }
}
