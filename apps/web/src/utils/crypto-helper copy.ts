const publicKeyStr = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg5oyYtMrbD2v+1hMW0uM
J6xSdkQ/ThQ8lBIMDEwGPPoIFeBLlAN8U7wNKOhnE4Gdq1eEXIvKdRGolgR2ErLF
6vTYZxeYmm9FffuKsmAbUrlHKxlqrpw53qwnzbsauj25cKW2uruk/EuoKS20p9a+
5VuQ2U6W9C6vd0EycwP4r+JR6GV4mCcUQEl9V9SQQt9i14HPLC6eObD/3pAdVk9r
pYTX0M5xQunAqUP7PzonDdwl231qiQDj9wTzNUYuEx31w6rzknqymjDMrnHo1Ayz
mW00f4IH1qb1cE/o/oiDG8+9dnO/o5zccChZu3Ks2jcVZ+PX924H19H38OZwsUeF
1wIDAQAB
-----END PUBLIC KEY-----
`;


// 将PEM格式的公钥转换为CryptoKey（前端所需的 publicKey）
async function genPublicKeyByStr(pemKey: string): Promise<CryptoKey> {
  // 移除PEM头尾和换行符
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pemKey.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "");

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

// 使用公钥加密
export async function encrypt(data: string): Promise<string> {
  const publicKey: CryptoKey = await genPublicKeyByStr(publicKeyStr)
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const encrypted = await window.crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, dataBuffer);

  // 将ArrayBuffer转换为Base64字符串
  const encryptedArray = new Uint8Array(encrypted);
  const base64String = btoa(String.fromCharCode(...encryptedArray));
  return base64String;
}