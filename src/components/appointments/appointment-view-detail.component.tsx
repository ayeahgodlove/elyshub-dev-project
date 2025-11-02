"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IAppointment } from "@/models/appointment.model";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEmployee } from "@/hooks/employee.hook";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface AppointmentViewDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: IAppointment | null;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function AppointmentViewDetail({
  open,
  onOpenChange,
  appointment,
}: AppointmentViewDetailProps) {
  const { employees } = useEmployee();

  if (!appointment) return null;

  const participantEmployees = employees.filter((emp) =>
    appointment.participants.includes(emp.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment.title}</DialogTitle>
          <DialogDescription>
            View detailed information about the appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{appointment.title}</h3>
              <div className="flex items-center gap-2">
                {appointment.status && (
                  <Badge
                    variant={
                      appointment.status === "scheduled"
                        ? "default"
                        : appointment.status === "completed"
                        ? "secondary"
                        : appointment.status === "cancelled"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {appointment.status}
                  </Badge>
                )}
                {appointment.type && (
                  <Badge variant="outline">{appointment.type}</Badge>
                )}
              </div>
            </div>
            {appointment.description && (
              <p className="text-sm text-muted-foreground">
                {appointment.description}
              </p>
            )}
          </div>

          <Separator />

          {/* Date and Time Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Schedule Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <label className="text-xs text-muted-foreground">Day</label>
                  <p className="text-sm font-medium">
                    {DAYS[appointment.day] || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <label className="text-xs text-muted-foreground">Time</label>
                  <p className="text-sm font-medium">{appointment.time}</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Start Hour
                </label>
                <p className="text-sm font-medium">{appointment.startHour}:00</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Duration</label>
                <p className="text-sm font-medium">
                  {appointment.duration} hour{appointment.duration !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location */}
          {appointment.location && (
            <>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Location
                    </label>
                    <p className="text-sm font-medium">
                      {appointment.location}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Participants */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">Participants</h4>
            </div>
            {participantEmployees.length > 0 ? (
              <div className="space-y-2">
                {participantEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={emp.avatar} alt={emp.name} />
                      <AvatarFallback className="text-xs">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.email} • {emp.department || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No participants assigned
              </p>
            )}
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Additional Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">
                  Appointment ID
                </label>
                <p className="text-sm font-medium">{appointment.id}</p>
              </div>
              {appointment.createdAt && (
                <div>
                  <label className="text-xs text-muted-foreground">
                    Created At
                  </label>
                  <p className="text-sm font-medium">
                    {new Date(appointment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
              {appointment.updatedAt && (
                <div>
                  <label className="text-xs text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm font-medium">
                    {new Date(appointment.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

