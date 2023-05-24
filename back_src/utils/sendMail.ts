import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export default async function sendEmail() {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Utiliser STARTTLS
    auth: {
      user: process.env.SMTP_USR, // Adresse e-mail de l'expéditeur
      pass: process.env.SMTP_PASSWORD, // Mot de passe de l'expéditeur
    },
  });

  // Définir les options de l'e-mail
  const mailOptions = {
    from: 'ultramatchassssssv2@gmail.com', // Adresse e-mail de l'expéditeur
    to: 'boyoxiy716@introace.com', // Adresse e-mail du destinataire
    subject: 'Hello from the hell',
    text: 'This is the body of the email.',
  };

  try {
    // Envoyer l'e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent:', info.messageId);
  } catch (error) {
    console.error('Error:', error);
  }
}