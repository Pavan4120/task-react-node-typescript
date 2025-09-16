/**
 * Frontend crypto utilities using crypto-js.
 * Frontend encrypts/decrypts JSON payloads with a client secret.
 *
 * The secret should be provided via environment or user input.
 */

import CryptoJS from 'crypto-js';

const CLIENT_SECRET = (import.meta.env.VITE_CLIENT_SECRET || 'client_demo_secret_123').toString();

export function clientEncrypt(obj: any): string {
  const json = JSON.stringify(obj);
  const ciphertext = CryptoJS.AES.encrypt(json, CLIENT_SECRET).toString();
  return ciphertext;
}

export function clientDecrypt(ciphertext: string): any {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CLIENT_SECRET);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if(!decrypted) return null;
  return JSON.parse(decrypted);
}
