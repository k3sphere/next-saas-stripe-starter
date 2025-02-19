import "server-only";

import { cache } from "react";
import { auth } from "@/auth";


export async function encrypt(plainData: string, encryptionKey: string) {
  // Ensure encryptionKey is exactly 32 bytes
  let keyBytes = Buffer.alloc(32);
  // copy encryptionKey to keyBytes
  keyBytes.write(encryptionKey, "utf-8");

  // Generate a random nonce of the correct GCM size (12 bytes)
  const nonce = crypto.getRandomValues(new Uint8Array(12));

  // Encode the plaintext
  const encodedData = new TextEncoder().encode(plainData);

  // Import the key into Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // Encrypt using AES-GCM
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    cryptoKey,
    encodedData
  );

  // Concatenate nonce + encrypted data (like the Go version)
  const combined = new Uint8Array(nonce.length + encryptedData.byteLength);
  combined.set(nonce);
  combined.set(new Uint8Array(encryptedData), nonce.length);

  // Encode as base64 (URL-safe format)
  return base64urlEncode(combined);
}

// Base64-URL encoding function (similar to Go's base64.RawURLEncoding)
function base64urlEncode(buffer: Uint8Array) {
  return Buffer.from(buffer)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Remove padding
}


export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});