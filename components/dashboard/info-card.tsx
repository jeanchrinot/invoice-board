import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InfoCardProps = {
  title: string;
  value: string | number;
  description: string; // make description required for clarity
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning" | "primary";
};

export default function InfoCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}: InfoCardProps) {
  const iconColors: Record<typeof variant, string> = {
    default: "text-primary",
    success: "text-green-500",
    danger: "text-red-500",
    warning: "text-yellow-500",
    primary: "text-blue-500",
  };

  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("size-4", iconColors[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// import { Users } from "lucide-react"

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// export default function InfoCard() {
//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
//         <Users className="size-4 text-muted-foreground" />
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">+2350</div>
//         <p className="text-xs text-muted-foreground">+180.1% from last month</p>
//       </CardContent>
//     </Card>
//   )
// }
