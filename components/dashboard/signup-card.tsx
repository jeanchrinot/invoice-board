import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignUpCard() {
  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <CardTitle>Sign up to save your work</CardTitle>
        <CardDescription>
          Create an account to save and share invoices, track changes, and
          access more features.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Link href="/register?redirect=/ai-assistant">
          <Button size="sm" className="w-full">
            Create a free account
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
