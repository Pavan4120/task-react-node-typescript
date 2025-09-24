import CryptoJS from 'crypto-js';

const CLIENT_SECRET = (import.meta.env.VITE_CLIENT_SECRET || 'client_demo_secret_123').toString();

// Encrypt individual field
export function encryptField(value: any): string {
  if (value === null || value === undefined || value === '') return '';
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  return CryptoJS.AES.encrypt(stringValue, CLIENT_SECRET).toString();
}

// Decrypt individual field
export function decryptField(ciphertext: string): any {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, CLIENT_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return '';
    
    // Try to parse as JSON, return as string if it fails
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

// Encrypt entire object field by field
export function encryptObject(obj: Record<string, any>): Record<string, string> {
  const encrypted: Record<string, string> = {};
  
  Object.keys(obj).forEach(key => {
    encrypted[key] = encryptField(obj[key]);
  });
  
  return encrypted;
}

// Decrypt entire object field by field
export function decryptObject(encryptedObj: Record<string, string>): Record<string, any> {
  const decrypted: Record<string, any> = {};
  
  Object.keys(encryptedObj).forEach(key => {
    decrypted[key] = decryptField(encryptedObj[key]);
  });
  
  return decrypted;
}

// For backward compatibility
export function clientEncrypt(obj: any): string {
  return encryptField(obj);
}

export function clientDecrypt(ciphertext: string): any {
  return decryptField(ciphertext);
}