"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppointment } from "@/hooks/appointment.hook";
import { useEmployee } from "@/hooks/employee.hook";
import { IAppointment } from "@/models/appointment.model";
import { UpdateMode } from "@/models/update-mode.enum";

const appointmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  participants: z.array(z.string()).min(1, "At least one participant is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.number().min(0.5, "Duration must be at least 0.5 hours"),
  day: z.number().min(0).max(6, "Day must be between 0-6"),
  startHour: z.number().min(0).max(23, "Hour must be between 0-23"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled", "rescheduled"]).optional(),
  color: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentForm({ open, onOpenChange }: AppointmentFormProps) {
  const { addAppointment, editAppointment, appointment, updateMode } = useAppointment();
  const { employees } = useEmployee();
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const isEditMode = updateMode === UpdateMode.EDIT && appointment?.id;

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: "",
      participants: [],
      time: "",
      duration: 1,
      day: 0,
      startHour: 8,
      location: "",
      type: "meeting",
      description: "",
      status: "scheduled",
      color: "bg-blue-100 border-l-4 border-blue-400",
    },
  });

  // Load form data when editing
  useEffect(() => {
    if (isEditMode && appointment) {
      form.reset({
        title: appointment.title || "",
        participants: appointment.participants || [],
        time: appointment.time || "",
        duration: appointment.duration || 1,
        day: appointment.day || 0,
        startHour: appointment.startHour || 8,
        location: appointment.location || "",
        type: appointment.type || "meeting",
        description: appointment.description || "",
        status: appointment.status || "scheduled",
        color: appointment.color || "bg-blue-100 border-l-4 border-blue-400",
      });
      setSelectedParticipants(appointment.participants || []);
    } else {
      form.reset({
        title: "",
        participants: [],
        time: "",
        duration: 1,
        day: 0,
        startHour: 8,
        location: "",
        type: "meeting",
        description: "",
        status: "scheduled",
        color: "bg-blue-100 border-l-4 border-blue-400",
      });
      setSelectedParticipants([]);
    }
  }, [isEditMode, appointment, form]);

  const onSubmit = (data: AppointmentFormValues) => {
    // Ensure we have participants
    if (selectedParticipants.length === 0) {
      form.setError("participants", { message: "At least one participant is required" });
      return;
    }

    // Format time string from hour and duration
    const startHour = data.startHour;
    const endHour = startHour + data.duration;
    const timeString = `${startHour % 12 || 12}${startHour >= 12 ? 'pm' : 'am'} - ${endHour % 12 || 12}${endHour >= 12 ? 'pm' : 'am'}`;

    if (isEditMode && appointment) {
      // Edit mode
      const updatedAppointment: IAppointment = {
        ...appointment,
        title: data.title,
        participants: selectedParticipants,
        time: data.time || timeString,
        duration: data.duration,
        day: data.day,
        startHour: data.startHour,
        location: data.location,
        type: data.type,
        description: data.description || "",
        status: data.status || "scheduled",
        color: data.color || "bg-blue-100 border-l-4 border-blue-400",
        updatedAt: new Date(),
      };

      editAppointment(updatedAppointment);
      toast.success("Appointment updated successfully!");
      form.reset();
      setSelectedParticipants([]);
      onOpenChange(false);
    } else {
      // Add mode
      const newAppointment: IAppointment = {
        id: nanoid(10),
        title: data.title,
        participants: selectedParticipants,
        time: data.time || timeString,
        duration: data.duration,
        day: data.day,
        startHour: data.startHour,
        location: data.location,
        type: data.type,
        description: data.description || "",
        status: data.status || "scheduled",
        color: data.color || "bg-blue-100 border-l-4 border-blue-400",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addAppointment(newAppointment);
      toast.success("Appointment created successfully!");
      form.reset();
      setSelectedParticipants([]);
      onOpenChange(false);
    }
  };

  const toggleParticipant = (employeeId: string) => {
    setSelectedParticipants((prev) => {
      const newParticipants = prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId];
      // Update form field value
      form.setValue("participants", newParticipants);
      return newParticipants;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Appointment" : "Add New Appointment"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the appointment details below."
              : "Fill in the details below to create a new appointment."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter appointment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter appointment description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="participants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participants *</FormLabel>
                  <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                    {employees.map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-2 py-2">
                        <Checkbox
                          id={employee.id}
                          checked={selectedParticipants.includes(employee.id)}
                          onCheckedChange={() => toggleParticipant(employee.id)}
                        />
                        <label htmlFor={employee.id} className="text-sm cursor-pointer">
                          {employee.name} ({employee.email})
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Monday</SelectItem>
                        <SelectItem value="1">Tuesday</SelectItem>
                        <SelectItem value="2">Wednesday</SelectItem>
                        <SelectItem value="3">Thursday</SelectItem>
                        <SelectItem value="4">Friday</SelectItem>
                        <SelectItem value="5">Saturday</SelectItem>
                        <SelectItem value="6">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Hour</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hour" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        min="0.5"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedParticipants([]);
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Update Appointment" : "Create Appointment"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

