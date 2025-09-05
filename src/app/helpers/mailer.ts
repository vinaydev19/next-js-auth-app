import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { useId } from "react";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const Token = await bcrypt.hash(useId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: Token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESETPASSWORD") {
      await User.findByIdAndUpdate(userId, {
        forgetPassword: Token,
        forgetPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOption = {
      from: "vinaydev19.projects@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "verify your email" : "reset your password",
      text: "Hello world?",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?Token=${Token}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
      or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?Token=${Token}
      </p>`,
    };

    const mailResponse = await transport.sendMail(mailOption);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
