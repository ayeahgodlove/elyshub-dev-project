import { DashboardCalendar } from "@/components/dashboard-calendar.component";
import { PageLayout } from "@/components/layout/page-layout.component";
import { Calendar } from "lucide-react";

export default function IndexPage() {

  return (
    <PageLayout pageTitle="Appointments" pageIcon={<Calendar className="w-5 h-5 text-foreground" />}>
      <DashboardCalendar />
    </PageLayout>
  );
}
