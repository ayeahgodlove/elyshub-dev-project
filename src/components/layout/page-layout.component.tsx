import React from "react";
import { Header } from "../header.component";

interface PageLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageIcon: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  pageIcon,
  pageTitle,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title={pageTitle} icon={pageIcon}/>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 container mx-auto">
        {children}
      </main>
    </div>
  );
};
