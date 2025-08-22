import crypto from 'crypto';



// 生成 RSA 密钥对
export const genKeyPair = () => {
  // const { publicKey, privateKey }
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    // publicExponent: 65537,
    // hash: 'sha256',
  });
};

// 使用公钥加密
export const encrypt = (data, publicKey) => {
  const buffer = Buffer.from(data, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted;
  // return encrypted.toString('base64');
};

// 使用私钥解密
export const decrypt = (encryptedData, privateKey) => {
  const buffer = Buffer.from(encryptedData, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted;
  // return decrypted.toString('utf8');
};

// 示例
// const data = 'Hello, World!';
// const encryptedData = encrypt(data, publicKey);
// console.log('加密后端的数据:', encryptedData);

// const decryptedData = decrypt(encryptedData, privateKey);
// console.log('解密后的数据:', decryptedData.toString());
