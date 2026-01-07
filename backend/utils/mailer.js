import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendApprovalMail = async (to, returnId, customerName = "") => {
  const mailOptions = {
    from: `"Risk Return System" <${process.env.MAIL_USER}>`,
    to,
    subject: `Return ${returnId} Approved`,
    html: `<p>Approved</p>`,
  };

  return transporter.sendMail(mailOptions);
};

export const sendRejectionMail = async (to, returnId, customerName = "") => {
  const mailOptions = {
    from: `"Risk Return System" <${process.env.MAIL_USER}>`,
    to,
    subject: `Return ${returnId} Rejected`,
    html: `<p>Rejected</p>`,
  };

  return transporter.sendMail(mailOptions);
};
