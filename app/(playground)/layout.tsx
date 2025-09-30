import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/playground/user-account-nav";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
      <div className="absolute right-5 top-5 flex gap-2">
        <ModeToggle />
        {/* <UserAccountNav /> */}
      </div>
    </div>
  );
}
