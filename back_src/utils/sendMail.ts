import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async function sendEmail(to: string, text: string, subject?: string) {

	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.SMTP_USR,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	const mailOptions = {
		from: "ultramatchassssssv2@gmail.com",
		to: to,
		subject: subject || "message",
		text: text,
	};

	const info = await transporter.sendMail(mailOptions);
	return {info, text};

}