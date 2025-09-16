/**
 * Server-side encryption utilities.
 * AES-256-CBC with random IV
 */
import crypto from 'crypto';

const ALGO = 'aes-256-cbc';

// Require 32-character SERVER_SECRET
const rawKey = process.env.SERVER_SECRET;
if (!rawKey || rawKey.length !== 32) {
  throw new Error("SERVER_SECRET must be exactly 32 characters long");
}
const KEY = Buffer.from(rawKey, 'utf8');

export function serverEncrypt(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function serverDecrypt(data: string): string {
  const [ivHex, encryptedHex] = data.split(':');
  if (!ivHex || !encryptedHex) throw new Error('Invalid encrypted data format');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}
