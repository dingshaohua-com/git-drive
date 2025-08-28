import nodemailer from "nodemailer";



const isDev = process.env.NODE_ENV === 'development';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "960423114@qq.com",
        pass: "jmjunnhegjsibahi",
    },
});

export const sendMail = (to, verifyCode, type) => {
    const typeLabel = {
        login: '登录验证码',
        resetPwd: '重置密码',
    }
    let html = `您的验证码为：<b>${verifyCode}</b>，有效期为1分钟，请妥善保管 👧`;
    if(type === 'resetPwd'){
        const webUrl =  isDev?'http://localhost:3004':'https://drive.dingshaohua.com';
        html = `您正在重置密码，请点击以下链接完成重置：
        <a href="${webUrl}/reset-pwd?email=${to}&code=${verifyCode}">${webUrl}/reset-pwd?email=${to}&code=${verifyCode}</a>
        `;
    }
    const params = {
        from: '"丁丁文档📕" <960423114@qq.com>',
        to, // "bar@example.com, baz@example.com"
        subject: typeLabel[type],
        text: "验证码", // plain‑text body
        html // HTML body
    }
    return transporter.sendMail(params);
}

