import * as CryptoJS from 'crypto-js';

export const encryptVault = (data: PasswordEntry[], key: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

export const decryptVault = (encryptedData: string, key: string): PasswordEntry[] | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedData) return null;
    return JSON.parse(decryptedData);
  } catch (e) {
    console.error("Decryption failed:", e);
    return null;
  }
};