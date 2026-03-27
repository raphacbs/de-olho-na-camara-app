/**
 * Device and application context utilities.
 *
 * Provides the values sent as informational headers on every SDUI request so
 * the BFF can log and analyse client context without breaking older clients
 * (all headers are optional on the server side).
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@fiscaliza/device_id';

/** Generates a random identifier formatted as a UUID v4 (best-effort). */
function generateDeviceId(): string {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

/**
 * Returns a stable device identifier, persisting it in AsyncStorage so the
 * same ID is reused across app sessions.
 */
export async function getOrCreateDeviceId(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (stored) return stored;
    const newId = generateDeviceId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch {
    return generateDeviceId();
  }
}

/** Client application version read from package.json. */
export function getAppVersion(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('../../package.json') as { version?: string };
    return pkg.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

/** Runtime platform identifier expected by the BFF: android | ios | web. */
export function getAppPlatform(): string {
  return Platform.OS;
}

/** Operating-system version string. */
export function getOSVersion(): string {
  return String(Platform.Version);
}

/**
 * Hardware model of the device.
 * Android exposes it via Platform.constants; iOS and web fall back gracefully.
 */
export function getDeviceModel(): string {
  if (Platform.OS === 'android') {
    const constants = Platform.constants as Record<string, unknown>;
    const model = constants?.Model as string | undefined;
    return model || 'Android Device';
  }
  if (Platform.OS === 'ios') {
    return 'iOS Device';
  }
  return 'Web';
}

/**
 * BCP-47 locale configured in the app.
 * Uses the Intl API when available, falling back to 'pt-BR'.
 */
export function getAppLanguage(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    return locale || 'pt-BR';
  } catch {
    return 'pt-BR';
  }
}
