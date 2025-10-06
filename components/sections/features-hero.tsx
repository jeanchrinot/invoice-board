import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Left content */}
          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Create invoices that{" "}
              <span className="text-gradient_indigo-purple">
                speak for you.
              </span>
            </h2>

            <p className="max-w-md text-gray-600 dark:text-gray-300">
              Simplify your client workflow with AI-powered invoice creation,
              automated reminders, and beautiful document templates.
            </p>

            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {[
                "AI-generated invoice details and summaries",
                "Quote → Invoice conversion in one click",
                "Automated payment tracking and reminders",
                "Instant PDF + Share link generation",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-indigo-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-indigo-700"
              >
                Start Exploring Now
                <i className="fa-sharp fa-solid fa-arrow-right ps-2"></i>
              </Link>
            </div>
          </div>

          {/* Right image */}
          <div className="relative flex justify-center md:justify-end">
            {/* Gradient card behind the image */}
            <div className="absolute right-8 top-8 -z-10 h-80 w-80 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-400 opacity-40 blur-2xl"></div>

            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10">
              <div className="p-4">
                <Image
                  src="/_static/demo/chat-sidebar.png"
                  alt="Invoice Preview"
                  width={800}
                  height={631}
                  className="rounded-xl object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
