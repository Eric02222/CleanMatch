import nodemailer from "nodemailer";

// Basic configuration for nodemailer
// You should add these to your .env file
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.mailtrap.io",
    port: process.env.MAIL_PORT || 2525,
    auth: {
        user: process.env.MAIL_USER || "your_user",
        pass: process.env.MAIL_PASS || "your_pass",
    },
});

export const sendResetPasswordEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    const mailOptions = {
        from: '"CleanMatch" <noreply@cleanmatch.com>',
        to: email,
        subject: "Recuperação de Senha - CleanMatch",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #059669; text-align: center;">Recuperação de Senha</h2>
                <p>Olá,</p>
                <p>Você solicitou a recuperação de senha para sua conta no <strong>CleanMatch</strong>.</p>
                <p>Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Recuperar Senha</a>
                </div>
                <p>Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666; text-align: center;">Equipe CleanMatch</p>
            </div>
        `,
    };

    return transporter.sendMail(mailOptions);
};
