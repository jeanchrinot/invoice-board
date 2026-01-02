import { Resend } from "resend";

import { prisma } from "@/lib/db"; // Ensure you have this file setting up PrismaClient
import WelcomeEmail from "@/components/emails/welcome-email";

const EMAIL_FROM = process.env.EMAIL_FROM!;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Send the "Welcome" email to the user
    // Note: Use 'onboarding@resend.dev' if you haven't verified your domain yet
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "You are on the list! 🚀",
      react: WelcomeEmail({ email }),
    });

    // 2. Save to your DB (Assumes a 'Waitlist' model exists in schema.prisma)
    await prisma.waitlist.create({
      data: {
        email,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return Response.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
