import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { sendOTPVerificationRequest } from "@/lib/email";

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    Resend({
      id: "resend-otp",
      name: "Email OTP",
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
      sendVerificationRequest: sendOTPVerificationRequest,
    }),

    CredentialsProvider({
      id: "otp-login",
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const { email, otp } = credentials as { email: string; otp: string };

        if (!email || !otp) {
          throw new Error("Missing email or OTP");
        }

        const normalizedEmail = email.toLowerCase();

        const otpRecord = await prisma.oTPCode.findFirst({
          where: {
            email: normalizedEmail,
            code: otp,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!otpRecord) {
          throw new Error("Invalid or expired OTP");
        }

        // Delete used OTP
        await prisma.oTPCode.delete({
          where: { id: otpRecord.id },
        });

        // Find or create user
        const user = await prisma.user.upsert({
          where: { email: normalizedEmail },
          update: {},
          create: {
            email: normalizedEmail,
            name: email.split("@")[0],
          },
        });

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/", // Your custom OTP login form
  },
} satisfies NextAuthConfig;
