/**
 * Encryption Utility Module
 * Provides client-side encryption/decryption using Web Crypto API
 * All sensitive data is encrypted before being sent to Supabase
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;

export interface EncryptionResult {
  encrypted: string;
  iv: string;
  salt: string;
}

/**
 * Generates a cryptographically secure random encryption key
 * @returns Base64-encoded encryption key
 */
export async function generateEncryptionKey(): Promise<string> {
  const key = await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true,
    ['encrypt', 'decrypt']
  );

  const exportedKey = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
}

/**
 * Derives an encryption key from a master password using PBKDF2
 * @param password User's master password
 * @param salt Salt for key derivation (base64 encoded)
 * @returns CryptoKey for encryption/decryption
 */
export async function deriveKeyFromPassword(
  password: string,
  salt?: string
): Promise<{ key: CryptoKey; salt: string }> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Generate or decode salt
  const saltBuffer = salt
    ? Uint8Array.from(atob(salt), (c) => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive actual encryption key
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );

  return {
    key,
    salt: btoa(String.fromCharCode(...saltBuffer)),
  };
}

/**
 * Converts base64 encoded key to CryptoKey
 * @param base64Key Base64-encoded encryption key
 * @returns CryptoKey for encryption/decryption
 */
async function importKey(base64Key: string): Promise<CryptoKey> {
  const keyBuffer = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
  
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using the provided encryption key
 * @param data Data to encrypt (string or object)
 * @param encryptionKey Base64-encoded encryption key
 * @returns Encrypted data with IV and salt
 */
export async function encryptData(
  data: string | number | object,
  encryptionKey: string
): Promise<EncryptionResult> {
  try {
    // Convert data to string if needed
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Import the encryption key
    const key = await importKey(encryptionKey);

    // Encrypt the data
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      dataBuffer
    );

    // Convert to base64 for storage
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const encrypted = btoa(String.fromCharCode(...encryptedArray));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    return {
      encrypted,
      iv: ivBase64,
      salt: '', // Salt is only used for password-derived keys
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data using the provided encryption key
 * @param encryptedData Encrypted data string
 * @param iv Initialization vector (base64)
 * @param encryptionKey Base64-encoded encryption key
 * @returns Decrypted data as string
 */
export async function decryptData(
  encryptedData: string,
  iv: string,
  encryptionKey: string
): Promise<string> {
  try {
    // Convert from base64
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) =>
      c.charCodeAt(0)
    );
    const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

    // Import the encryption key
    const key = await importKey(encryptionKey);

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: ivBuffer,
      },
      key,
      encryptedBuffer
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Encrypts data with password-derived key
 * @param data Data to encrypt
 * @param password Master password
 * @returns Encrypted data with IV and salt
 */
export async function encryptWithPassword(
  data: string | number | object,
  password: string
): Promise<EncryptionResult> {
  const { key, salt } = await deriveKeyFromPassword(password);
  
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(dataString);

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
    },
    key,
    dataBuffer
  );

  const encryptedArray = new Uint8Array(encryptedBuffer);
  const encrypted = btoa(String.fromCharCode(...encryptedArray));
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return {
    encrypted,
    iv: ivBase64,
    salt,
  };
}

/**
 * Decrypts data with password-derived key
 * @param encryptedData Encrypted data string
 * @param iv Initialization vector (base64)
 * @param salt Salt used for key derivation (base64)
 * @param password Master password
 * @returns Decrypted data as string
 */
export async function decryptWithPassword(
  encryptedData: string,
  iv: string,
  salt: string,
  password: string
): Promise<string> {
  const { key } = await deriveKeyFromPassword(password, salt);

  const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) =>
    c.charCodeAt(0)
  );
  const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv: ivBuffer,
    },
    key,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Validates encryption key format
 * @param key Base64-encoded key to validate
 * @returns true if valid, false otherwise
 */
export function validateEncryptionKey(key: string): boolean {
  try {
    const decoded = atob(key);
    return decoded.length === KEY_LENGTH / 8;
  } catch {
    return false;
  }
}

/**
 * Storage helper for encryption key
 */
export const keyStorage = {
  KEY_NAME: 'datum_encryption_key',
  SALT_NAME: 'datum_key_salt',

  /**
   * Stores encryption key in localStorage
   * WARNING: This is less secure than password derivation
   */
  save(key: string, salt?: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.KEY_NAME, key);
    if (salt) {
      localStorage.setItem(this.SALT_NAME, salt);
    }
  },

  /**
   * Retrieves encryption key from localStorage
   */
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.KEY_NAME);
  },

  /**
   * Retrieves salt from localStorage
   */
  getSalt(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.SALT_NAME);
  },

  /**
   * Removes encryption key from localStorage
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.KEY_NAME);
    localStorage.removeItem(this.SALT_NAME);
  },

  /**
   * Checks if encryption key exists
   */
  exists(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.KEY_NAME) !== null;
  },
};
