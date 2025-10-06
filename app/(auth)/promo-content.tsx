import { Icons } from "@/components/shared/icons";

const AuthPromoContent = () => {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 lg:flex lg:w-1/2">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 mx-auto flex max-w-lg flex-col justify-center p-12 text-white">
        <div className="mb-8">
          {/* <Icons.logo className="mb-6 size-10 text-white" /> */}
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            Professional Invoicing Made Simple
          </h1>
          <p className="text-xl leading-relaxed text-blue-100">
            {`Join thousands of professionals who've streamlined their invoicing
            process with our AI-powered platform.`}
          </p>
        </div>

        {/* Key Benefits */}
        <div className="mb-8 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="mt-1 rounded-full bg-white/20 p-2">
              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">
                AI-Powered Invoice Generation
              </h3>
              <p className="text-sm text-blue-100">
                Create professional invoices in seconds with intelligent content
                suggestions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="mt-1 rounded-full bg-white/20 p-2">
              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Cloud-Based Storage</h3>
              <p className="text-sm text-blue-100">
                Access your invoices anywhere, anytime with secure cloud
                synchronization.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="mt-1 rounded-full bg-white/20 p-2">
              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Professional Templates</h3>
              <p className="text-sm text-blue-100">
                Choose from beautiful, customizable templates that impress
                clients.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Update */}
        {/* <div className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <div className="mt-1 rounded-full bg-green-400 p-1">
              <svg
                className="size-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold">
                New: Enhanced AI Templates
              </p>
              <p className="text-sm leading-relaxed text-blue-100">
                {`We've upgraded our AI engine with industry-specific templates
                for faster, more accurate invoice generation.`}
              </p>
              <p className="mt-2 text-xs text-blue-200">Released this week</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-20 top-20 size-32 rounded-full bg-white/10 blur-xl"></div>
      <div className="absolute bottom-20 right-20 size-48 rounded-full bg-purple-400/20 blur-2xl"></div>
    </div>
  );
};

export default AuthPromoContent;
