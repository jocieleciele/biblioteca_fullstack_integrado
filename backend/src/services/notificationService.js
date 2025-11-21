// backend/src/services/notificationService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuração do "transportador" de e-mail.
// Use um serviço como o Mailtrap.io para testes ou configure seu provedor (Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para porta 465, false para outras
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia um e-mail de notificação de que um item reservado está disponível.
 * @param {string} userEmail - E-mail do destinatário.
 * @param {string} userName - Nome do destinatário.
 * @param {string} materialTitle - Título do material.
 */
export const sendReservationAvailableEmail = async (
  userEmail,
  userName,
  materialTitle
) => {
  const mailOptions = {
    from: '"Biblioteca Digital" <noreply@biblioteca.com>',
    to: userEmail,
    subject: "Sua reserva está disponível para retirada!",
    html: `
      <p>Olá, ${userName}!</p>
      <p>O item "<b>${materialTitle}</b>" que você reservou já está disponível para retirada na biblioteca.</p>
      <p>Você tem 48 horas para retirá-lo antes que a reserva expire.</p>
      <br>
      <p>Atenciosamente,</p>
      <p>Equipe da Biblioteca Digital</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`E-mail de notificação enviado para ${userEmail}`);
};
