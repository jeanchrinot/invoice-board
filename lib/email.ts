// import { MagicLinkEmail } from "@/emails/magic-link-email";
import { EmailConfig } from "next-auth/providers/email";
import { Resend } from "resend";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/db";

import { getUserByEmail } from "./user";

export const resend = new Resend(env.RESEND_API_KEY);

// export const sendVerificationRequest: EmailConfig["sendVerificationRequest"] =
//   async ({ identifier, url, provider }) => {
//     const user = await getUserByEmail(identifier);
//     if (!user || !user.name) return;

//     const userVerified = user?.emailVerified ? true : false;
//     const authSubject = userVerified
//       ? `Sign-in link for ${siteConfig.name}`
//       : "Activate your account";

//     try {
//       const { data, error } = await resend.emails.send({
//         from: provider.from,
//         to:
//           process.env.NODE_ENV === "development"
//             ? "delivered@resend.dev"
//             : identifier,
//         subject: authSubject,
//         react: MagicLinkEmail({
//           firstName: user?.name as string,
//           actionUrl: url,
//           mailType: userVerified ? "login" : "register",
//           siteName: siteConfig.name,
//         }),
//         // Set this to prevent Gmail from threading emails.
//         // More info: https://resend.com/changelog/custom-email-headers
//         headers: {
//           "X-Entity-Ref-ID": new Date().getTime() + "",
//         },
//       });

//       if (error || !data) {
//         throw new Error(error?.message);
//       }

//       // console.log(data)
//     } catch (error) {
//       throw new Error("Failed to send verification email.");
//     }
//   };

export const sendOTPVerificationRequest: EmailConfig["sendVerificationRequest"] =
  async ({ identifier, url, provider }) => {
    const user = await getUserByEmail(identifier);
    // if (!user || !user.name) return;

    const userVerified = user?.emailVerified ? true : false;
    const authSubject = userVerified
      ? `Sign-in code for ${siteConfig.name}`
      : "Activate your account";

    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in separate table
      await prisma.oTPCode.create({
        data: {
          email: identifier.toLowerCase(),
          code: otp,
          expiresAt,
        },
      });

      const { data, error } = await resend.emails.send({
        from: provider.from,
        to: identifier,
        subject: authSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">Your Sign-in Code</h1>
              <p style="color: #666; margin: 0;">Hi ${user?.name}, enter this code to sign in to ${siteConfig.name}</p>
            </div>
            
            <div style="background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #333; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px; margin: 5px 0;">This code will expire in 10 minutes</p>
              <p style="color: #999; font-size: 12px; margin: 5px 0;">If you didn't request this code, please ignore this email</p>
            </div>
          </div>
        `,
        // Set this to prevent Gmail from threading emails.
        headers: {
          "X-Entity-Ref-ID": new Date().getTime() + "",
        },
      });

      if (error || !data) {
        throw new Error(error?.message);
      }

      // console.log(data)
    } catch (error) {
      console.log("error", error);
      throw new Error("Failed to send OTP verification email.");
    }
  };
