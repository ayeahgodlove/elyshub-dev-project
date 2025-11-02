"use client";

import { useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployee } from "@/hooks/employee.hook";
import { IEmployee } from "@/models/employee.model";
import { UpdateMode } from "@/models/update-mode.enum";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  reportTo: z.string().min(1, "Report to is required"),
  department: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  status: z.enum(["active", "inactive", "on-leave"]).optional(),
  joinedDate: z.string().optional(),
  salary: z.number().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeForm({ open, onOpenChange }: EmployeeFormProps) {
  const { addEmployee, editEmployee, employees, employee, updateMode } = useEmployee();
  const isEditMode = updateMode === UpdateMode.EDIT && employee?.id;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      reportTo: "",
      department: "",
      position: "",
      phone: "",
      avatar: "",
      status: "active",
      joinedDate: "",
      salary: 0,
    },
  });

  // Load form data when editing
  useEffect(() => {
    if (isEditMode && employee) {
      form.reset({
        name: employee.name || "",
        email: employee.email || "",
        category: employee.category || "",
        reportTo: employee.reportTo || "",
        department: employee.department || "",
        position: employee.position || "",
        phone: employee.phone || "",
        avatar: employee.avatar || "",
        status: employee.status || "active",
        joinedDate: employee.joinedDate || new Date().toISOString().split("T")[0],
        salary: employee.salary || 0,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        category: "",
        reportTo: "",
        department: "",
        position: "",
        phone: "",
        avatar: "",
        status: "active",
        joinedDate: "",
        salary: 0,
      });
    }
  }, [isEditMode, employee, form]);

  // Get unique managers for reportTo dropdown
  const uniqueManagers = Array.from(
    new Set(employees.map((e) => e.reportTo))
  ).filter(Boolean);

  const onSubmit = (data: EmployeeFormValues) => {
    if (isEditMode && employee) {
      // Edit mode
      const updatedEmployee: IEmployee = {
        ...employee,
        name: data.name,
        email: data.email,
        category: data.category,
        reportTo: data.reportTo,
        department: data.department || "",
        position: data.position || "",
        phone: data.phone || "",
        avatar:
          data.avatar ||
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
        status: data.status || "active",
        joinedDate: data.joinedDate || new Date().toISOString().split("T")[0],
        salary: data.salary || 0,
      };

      editEmployee(updatedEmployee);
      toast.success("Employee updated successfully!");
      form.reset();
      onOpenChange(false);
    } else {
      // Add mode - Generate ID using nanoid(10)
      const newId = `#${nanoid(10)}`;

      const newEmployee: IEmployee = {
        id: newId,
        name: data.name,
        email: data.email,
        category: data.category,
        reportTo: data.reportTo,
        department: data.department || "",
        position: data.position || "",
        phone: data.phone || "",
        avatar:
          data.avatar ||
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
        status: data.status || "active",
        joinedDate: data.joinedDate || new Date().toISOString().split("T")[0],
        salary: data.salary || 0,
      };

      addEmployee(newEmployee);
      toast.success("Employee added successfully!");
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the employee details below."
              : "Fill in the details below to add a new employee to the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employee name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reportTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report To *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {uniqueManagers.map((manager) => (
                          <SelectItem key={manager} value={manager}>
                            {manager}
                          </SelectItem>
                        ))}
                        {field.value && !uniqueManagers.includes(field.value) && (
                          <SelectItem value={field.value}>
                            {field.value}
                          </SelectItem>
                        )}
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter position" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joinedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joined Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="on-leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter salary"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter avatar URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Update Employee" : "Add Employee"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

