"use client";

import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

const AuthPageContent = () => {
  const params = useSearchParams();
  const register = params.get("register");
  console.log("register", register);
  return (
    <div className="container flex flex-col items-center justify-center py-10 lg:h-screen lg:py-0">
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto size-6" />
          <h2 className="text-2xl font-semibold tracking-tight">
            {`Let's get started`}
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <Suspense>
          {register ? <UserAuthForm type="register" /> : <UserAuthForm />}
        </Suspense>

        {register ? (
          <>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link
                href="/terms"
                className="hover:text-brand underline underline-offset-4"
                target={"_blank"}
              >
                terms and conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="hover:text-brand underline underline-offset-4"
                target={"_blank"}
              >
                privacy policy
              </Link>
              .
            </p>
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/"
                className="hover:text-brand underline underline-offset-4"
              >
                Already have an account? Sign In
              </Link>
            </p>
          </>
        ) : (
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="?register=true"
              className="hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPageContent;
