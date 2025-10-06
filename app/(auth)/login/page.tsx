import { Suspense } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

import AuthPromoContent from "../promo-content";
import AuthQuickBenefits from "../quick-benefits";

export const metadata = {
  title: "Sign in to your account",
  description: "Sign in to access your invoices and dashboard.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Promotional Content */}
      <AuthPromoContent />

      {/* Right Panel - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-8 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Header (visible on small screens) */}
          <div className="mb-8 text-center lg:hidden">
            <Icons.logo className="mx-auto mb-4 size-8" />
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Continue where you left off
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-800 dark:bg-black/20 dark:shadow-2xl">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Sign In To Your Account
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Access your invoice dashboard and continue your work
              </p>
            </div>

            {/* Login Form */}
            <Suspense>
              <UserAuthForm type="login" />
            </Suspense>

            {/* Forgot Password */}
            {/* <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot your password?
              </Link>
            </div> */}

            {/* Don't have account */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {`Don't have an account? `}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* <AuthQuickBenefits /> */}
          </div>

          {/* Security Notice */}
          {/* <div className="mt-6 text-center">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              Your data is protected with enterprise-grade security
            </p>
            <div className="flex items-center justify-center space-x-4 opacity-60">
              <div className="text-xs text-gray-400 dark:text-gray-500">
                🔐 End-to-end encryption
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                🛡️ SOC 2 compliant
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                ⚡ Secure login
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
