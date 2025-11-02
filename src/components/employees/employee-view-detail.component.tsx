"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IEmployee } from "@/models/employee.model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface EmployeeViewDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: IEmployee | null;
}

export function EmployeeViewDetail({
  open,
  onOpenChange,
  employee,
}: EmployeeViewDetailProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            View detailed information about the employee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback className="text-lg">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant={
                    employee.status === "active"
                      ? "default"
                      : employee.status === "inactive"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {employee.status || "inactive"}
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {employee.category}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">ID</label>
                <p className="text-sm font-medium">{employee.id}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <p className="text-sm font-medium">{employee.email}</p>
              </div>
              {employee.phone && (
                <div>
                  <label className="text-xs text-muted-foreground">Phone</label>
                  <p className="text-sm font-medium">{employee.phone}</p>
                </div>
              )}
              {employee.joinedDate && (
                <div>
                  <label className="text-xs text-muted-foreground">
                    Joined Date
                  </label>
                  <p className="text-sm font-medium">{employee.joinedDate}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Work Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Work Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">
                  Department
                </label>
                <p className="text-sm font-medium">
                  {employee.department || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Position</label>
                <p className="text-sm font-medium">
                  {employee.position || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Report To
                </label>
                <p className="text-sm font-medium">{employee.reportTo}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <p className="text-sm font-medium">{employee.category}</p>
              </div>
              {employee.salary && (
                <div>
                  <label className="text-xs text-muted-foreground">Salary</label>
                  <p className="text-sm font-medium">
                    ${employee.salary.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

