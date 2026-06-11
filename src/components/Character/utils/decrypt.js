function getSubtleCrypto() {
  if (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    window.crypto &&
    window.crypto.subtle
  ) {
    return window.crypto.subtle;
  }
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    globalThis.crypto.subtle
  ) {
    return globalThis.crypto.subtle;
  }
  return null;
}

async function generateAESKey(password) {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error(
      "Web Crypto API is unavailable. Please use a modern, secure browser (https) with crypto.subtle support.",
    );
  }
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await subtle.digest("SHA-256", passwordBuffer);
  return subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"],
  );
}

export const decryptFile = async (url, password) => {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error(
      "Web Crypto API is unavailable. Please use a modern, secure browser (https) with crypto.subtle support.",
    );
  }
  const response = await fetch(url);
  const encryptedData = await response.arrayBuffer();
  const iv = new Uint8Array(encryptedData.slice(0, 16));
  const data = encryptedData.slice(16);
  const key = await generateAESKey(password);
  return subtle.decrypt({ name: "AES-CBC", iv }, key, data);
};
