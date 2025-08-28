import reqCtx from '@/middleware/req-ctx';
import { decryptAll, toHash } from '@dingshaohua.com/hybrid-crypto';
import { user as User, sys_conf as SysConf } from '@prisma/client';


type PweVerifyParams = {
  password: string;
  aseKeyEncrypt: string;
};
const pwdVerify = (params: PweVerifyParams, user: User) => {
  // 解密传输过来加密的密码
  const sysConf = reqCtx.get<SysConf>('sysConf');
  const contentAndKey = {
    contentEncrypt: params.password,
    aseKeyEncrypt: params.aseKeyEncrypt,
  };
  const content = decryptAll(contentAndKey, sysConf.privateKey);
  const hashContent = toHash(content, user.salt);
  if (user.password === hashContent.hash) {
    return true;
  } else {
    return false;
  }
};

export default pwdVerify;
