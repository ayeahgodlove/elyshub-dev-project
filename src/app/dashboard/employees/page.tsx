import { EmployeeTable } from "@/components/employee-table.component";
import { PageLayout } from "@/components/layout/page-layout.component";
import { Users } from "lucide-react";
import React from "react";

export default function IndexPage() {
  return (
    <PageLayout pageTitle="Employees" pageIcon={<Users className="w-5 h-5 text-foreground" />}>
      <EmployeeTable />
    </PageLayout>

  );
}
