import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};

// export const sendEmail = async (options) => {
//   const isDev = process.env.NODE_ENV !== 'production';

//   if (isDev) {
//     console.log('\n--- MOCK EMAIL ---');
//     console.log('To:', options.to);
//     console.log('Subject:', options.subject);
//     console.log('HTML:', options.html);
//     console.log('--- END ---\n');
//     return;
//   }

//   try {
//     return await transporter.sendMail(options);
//   } catch (error) {
//     console.error('Email send failed:', error.message);
//     throw error;
//   }
// };
