// 导入本地PEM文件内容
import publicKeyPem from './publicKey.pem?raw';


// 生成前端自己的 AES 密钥
export const genAESKey = async (): Promise<CryptoKey> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256, // 256位密钥
    },
    true, // 可导出
    ['encrypt', 'decrypt'] // 用途
  );
}

// 导出AES密钥为Base64字符串
export const exportAESKey = async (key: CryptoKey): Promise<string> => {
  const keyBuffer = await window.crypto.subtle.exportKey('raw', key);
  const keyArray = new Uint8Array(keyBuffer);
  return btoa(String.fromCharCode(...keyArray));
}

// 使用前端自己的AES加密
export async function aesEncrypt(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, key, dataBuffer);

  // 将ArrayBuffer转换为Base64字符串
  const encryptedArray = new Uint8Array(encrypted);
  const base64String = btoa(String.fromCharCode(...encryptedArray));
  return base64String;
}




// 导入从后端或者其他地方获取的PEM内容（字符串），生成RSA公钥（CryptoKey格式）
async function importPublicKeyFromPem(pemText: string): Promise<CryptoKey> {

  // 移除PEM头尾和换行符
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pemText.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");

  // Base64解码
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  // 导入公钥
  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    false,
    ["encrypt"]
  );
}

// 使用后端rsa公钥加密
export async function encrypt(data: string): Promise<string> {
  const publicKey = await importPublicKeyFromPem(publicKeyPem);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const encrypted = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, dataBuffer);

  // 将ArrayBuffer转换为Base64字符串
  const encryptedArray = new Uint8Array(encrypted);
  const base64String = btoa(String.fromCharCode(...encryptedArray));
  console.log('base64String', base64String);
  
  return base64String;
}



export const genAesAndEncrypt = async (content)=>{
  const aseKey = await genAESKey(); // 生成AES密钥
  const aseKeyStr = await exportAESKey(aseKey); // 导出AES密钥为Base64字符串
  const aseKeyEncrypt = await encrypt(aseKeyStr); // 用RSA公钥加密AES密钥
  const contentEncrypt = await aesEncrypt(content, aseKey); // 用AES密钥加密内容
  return {
    aseKeyEncrypt,
    contentEncrypt,
  };
}