"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

type FormData = z.infer<typeof userAuthSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: otpErrors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [showOTPInput, setShowOTPInput] = React.useState<boolean>(false);
  const [userEmail, setUserEmail] = React.useState<string>("");
  const searchParams = useSearchParams();
  const otpInputRef = React.useRef<HTMLInputElement>(null);

  // Clear and focus OTP input when shown
  React.useEffect(() => {
    if (showOTPInput && otpInputRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        if (otpInputRef.current) {
          otpInputRef.current.value = "";
          otpInputRef.current.focus();
        }
      }, 100);
    }
  }, [showOTPInput]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setUserEmail(data.email.toLowerCase());

    try {
      // Use the OTP provider from NextAuth
      const signInResult = await signIn("resend-otp", {
        email: data.email.toLowerCase(),
        redirect: false,
      });

      if (!signInResult?.ok) {
        throw new Error("Failed to send verification code");
      }

      setShowOTPInput(true);
      toast.success("Check your email", {
        description: "We sent you a 6-digit verification code.",
      });
    } catch (error) {
      toast.error("Something went wrong.", {
        description: "Failed to send verification code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmitOTP(data: OTPFormData) {
    setIsLoading(true);

    try {
      // Verify OTP through custom API endpoint
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          otp: data.otp,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid verification code");
      }

      // sign in the user
      const signInResult = await signIn("otp-login", {
        email: userEmail,
        otp: data.otp,
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/ai-assistant",
      });

      if (!signInResult?.ok) {
        throw new Error("Sign in failed");
      }

      toast.success("Successfully signed in!");

      // Redirect to callback URL
      window.location.href = searchParams?.get("from") || "/ai-assistant";
    } catch (error) {
      toast.error("Invalid code", {
        description:
          error instanceof Error
            ? error.message
            : "Please check your code and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleBackToEmail = () => {
    setShowOTPInput(false);
    setUserEmail("");
  };

  if (showOTPInput) {
    return (
      <div className={cn("grid gap-6", className)} {...props}>
        <form onSubmit={handleSubmitOTP(onSubmitOTP)} autoComplete="off">
          <div className="grid gap-2">
            <div className="grid gap-1">
              {/* Hidden decoy input to trick autofill */}
              <input
                type="email"
                autoComplete="username"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                tabIndex={-1}
                aria-hidden="true"
              />
              <Label className="sr-only" htmlFor="otp">
                Verification Code
              </Label>
              <Input
                {...registerOTP("otp")}
                // ref={otpInputRef}
                id="otp"
                // name="verification-code" // Non-standard name
                placeholder="Enter 6-digit code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoCapitalize="none"
                autoComplete="one-time-code" // Specific for OTP
                autoCorrect="off"
                spellCheck={false}
                disabled={isLoading}
                maxLength={6}
                className="border-gray-400 text-center text-2xl tracking-widest focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-gray-100"
                data-form-type="other" // Additional hint for browsers
              />
              {otpErrors?.otp && (
                <p className="px-1 text-xs text-red-600">
                  {otpErrors.otp.message}
                </p>
              )}
              <p className="px-1 text-xs text-muted-foreground">
                We sent a code to {userEmail}
              </p>
            </div>
            <button className={cn(buttonVariants())} disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              Verify Code
            </button>
            <button
              type="button"
              onClick={handleBackToEmail}
              className={cn(buttonVariants({ variant: "ghost" }))}
              disabled={isLoading}
            >
              Back to Email
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register("email")}
              className="border-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-gray-100"
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {type === "register" ? "Sign Up with Email" : "Sign In with Email"}
          </button>
        </div>
      </form>
    </div>
  );
}
