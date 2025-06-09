// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 },
      );
    }

    // If using separate OTP table
    const newDate = new Date();
    console.log("newDate", newDate);
    const otpRecord = await prisma.oTPCode.findFirst({
      where: {
        email: email.toLowerCase(),
        code: otp,
        expiresAt: {
          gt: newDate,
        },
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    // // Clean up used OTP
    // await prisma.oTPCode.delete({
    //   where: {
    //     id: otpRecord.id,
    //   },
    // });

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
