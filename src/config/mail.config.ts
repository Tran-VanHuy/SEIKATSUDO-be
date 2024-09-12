import { registerAs } from '@nestjs/config';
import nodemailer from 'nodemailer';

export default registerAs('mail', () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
});
