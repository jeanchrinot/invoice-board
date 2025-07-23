const AuthQuickBenefits = () => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
      <p className="mb-3 text-center text-sm font-medium text-gray-900 dark:text-white">
        {`What you'll get:`}
      </p>
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <div className="mr-2 size-2 rounded-full bg-green-500"></div>
          Unlimited invoices
        </div>
        <div className="flex items-center">
          <div className="mr-2 size-2 rounded-full bg-green-500"></div>
          Save & Share Invoices
        </div>
        <div className="flex items-center">
          <div className="mr-2 size-2 rounded-full bg-green-500"></div>
          Track Changes
        </div>
        <div className="flex items-center">
          <div className="mr-2 size-2 rounded-full bg-green-500"></div>
          More Features
        </div>
      </div>
    </div>
  );
};

export default AuthQuickBenefits;
