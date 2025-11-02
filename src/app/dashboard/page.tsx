import { PageLayout } from "@/components/layout/page-layout.component";
import { LayoutDashboard } from "lucide-react";

export default function IndexPage() {
  return (
    <PageLayout pageTitle="Dashboard" pageIcon={<LayoutDashboard className="w-4 h-4 text-foreground" />}>
      <h1>Dashboard Component</h1>
    </PageLayout>

  );
}
