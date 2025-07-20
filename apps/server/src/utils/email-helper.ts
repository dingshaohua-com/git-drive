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

export const sendMail = (to, content) => {
    const params = {
        from: '"丁丁文档📕" <960423114@qq.com>',
        to, // "bar@example.com, baz@example.com"
        subject: "登录验证码",
        text: "验证码", // plain‑text body
        html: `您的验证码为：<b>${content}</b>`, // HTML body
    }
    return transporter.sendMail(params);
}

