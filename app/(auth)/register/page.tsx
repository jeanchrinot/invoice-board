import { Suspense } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

import AuthPromoContent from "../promo-content";
import AuthQuickBenefits from "../quick-benefits";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      <AuthPromoContent />

      {/* Right Panel - Sign Up Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-8 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Header (visible on small screens) */}
          <div className="mb-8 text-center lg:hidden">
            {/* <Icons.logo className="mx-auto mb-4 size-8" /> */}
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Get Started Today
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join thousands of professionals worldwide
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-black/20 dark:shadow-2xl">
            {/* Header */}
            <div className="mb-6 text-center">
              {/* <div className="hidden lg:block">
                <Icons.logo className="mx-auto mb-4 size-8" />
              </div> */}
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Create Your Account
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Start creating professional invoices in under 2 minutes
              </p>
            </div>

            {/* Sign Up Form */}
            <Suspense>
              <UserAuthForm type="register" />
            </Suspense>

            {/* Already have account */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Terms and Privacy */}
            <p className="mt-6 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Privacy Policy
              </Link>
            </p>

            {/* Quick Benefits */}
            {/* <AuthQuickBenefits /> */}
          </div>

          {/* Trust Indicators */}
          {/* <div className="mt-6 text-center">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              Trusted by 50,000+ professionals worldwide
            </p>
            <div className="flex items-center justify-center space-x-4 opacity-60">
              <div className="text-xs text-gray-400 dark:text-gray-500">
                🔒 Bank-level security
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                ⚡ 99.9% uptime
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                🌍 Global support
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
