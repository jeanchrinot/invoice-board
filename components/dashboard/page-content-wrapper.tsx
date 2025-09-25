interface PageContentWrapperProps {
  children?: React.ReactNode;
}

export function PageContentWrapper({ children }: PageContentWrapperProps) {
  return (
    <div className="relative flex h-full flex-col space-y-4 overflow-hidden bg-gray-100 px-4 py-6 dark:bg-gray-900 dark:text-white">
      {children}
    </div>
  );
}
