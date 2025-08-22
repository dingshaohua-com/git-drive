import nodemailer from "nodemailer";

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

export const sendMail = (to, content, type) => {
    const params = {
        from: '"丁丁文档📕" <960423114@qq.com>',
        to, // "bar@example.com, baz@example.com"
        subject: type==='login'?"登录验证码":'重置密码',
        text: "验证码", // plain‑text body
        html: `您的验证码为：<b>${content}</b>，有效期为1分钟，请妥善保管 👧`, // HTML body
    }
    return transporter.sendMail(params);
}

