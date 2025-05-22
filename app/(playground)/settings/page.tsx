import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { UserNameForm } from "@/components/forms/user-name-form";
import { UserRoleForm } from "@/components/forms/user-role-form";
import HomeHero from "@/components/sections/home-hero";

export const metadata = constructMetadata({
  title: "Settings | Freelancer AI Assistant",
  description: "Configure your account and website settings.",
  noIndex: true,
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <div className="container grid w-screen flex-col items-center justify-center bg-muted lg:h-screen lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="lg:p-8">
          <HomeHero />
        </div>
        <div className="h-full flex-col bg-white px-4 pt-10 lg:block">
          <h2 className="mb-4 text-balance text-center font-urban text-xl font-extrabold tracking-tight sm:text-2xl md:text-2xl">
            Settings{" "}
          </h2>
          <p className="mb-6 text-balance text-center text-sm leading-normal text-muted-foreground">
            Manage your account.
          </p>
          <div className="divide-y divide-muted pb-10">
            <UserNameForm user={{ id: user.id, name: user.name || "" }} />
            <DeleteAccountSection />
          </div>
        </div>
      </div>
    </>
  );
}
