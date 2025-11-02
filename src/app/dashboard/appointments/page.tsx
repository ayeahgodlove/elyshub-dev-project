import { DashboardCalendar } from "@/components/calendar.component";
import { PageLayout } from "@/components/layout/page-layout.component";
import { Calendar } from "lucide-react";

export default function IndexPage() {

  return (
    <PageLayout pageTitle="Appointments" pageIcon={<Calendar className="w-4 h-4 text-foreground" />}>
      <DashboardCalendar />
    </PageLayout>
  );
}
