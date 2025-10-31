"use client";
import React, { useState } from "react";
import { Search, Plus, Download, MoreVertical, Calendar, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { employees } from "@/data/employee.data";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";

export function EmployeeTable() {
  const [filterName, setFilterName] = React.useState("");
  const [filterReportTo, setFilterReportTo] = React.useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const filteredEmployees = employees.filter((employee) => {
    const matchesName =
      !filterName ||
      employee.name.toLowerCase().includes(filterName.toLowerCase()) ||
      employee.email.toLowerCase().includes(filterName.toLowerCase());

    const matchesReportTo =
      !filterReportTo || filterReportTo === "all" || employee.reportTo === filterReportTo;

    return matchesName && matchesReportTo;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employeeId]);
    } else {
      setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "ID", "Email", "Category", "Report to"];
    const rows = filteredEmployees.map((emp) => [
      emp.name,
      emp.id,
      emp.email,
      emp.category,
      emp.reportTo,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employees.csv";
    link.click();
  };

  const isAllSelected =
    filteredEmployees.length > 0 &&
    selectedEmployees.length === filteredEmployees.length;
  const isIndeterminate =
    selectedEmployees.length > 0 &&
    selectedEmployees.length < filteredEmployees.length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your team members and their account permissions here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-lg">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Search by name..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Report To</Label>
                      <Select
                        onValueChange={(value) => setFilterReportTo(value)}
                        value={filterReportTo}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Managers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {[...new Set(filteredEmployees.map((e) => e.reportTo))].map((manager) => (
                            <SelectItem key={manager} value={manager}>
                              {manager}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end gap-3">
              <Select>
                <SelectTrigger className="w-[140px] ml-auto">
                  <div className="flex items-center gap-2 text-blue-950">
                    <Calendar size={15} />
                    <SelectValue placeholder="Select dates" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="thismonth">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className={
                      isIndeterminate
                        ? "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground"
                        : ""
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report to
                </th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={(checked) =>
                        handleSelectEmployee(employee.id, checked as boolean)
                      }
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={employee.avatar}
                        alt={employee.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://dummyimage.com/40x40/e5e5e5/666666?text=${employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}`;
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        {/* <div className="text-sm text-gray-500">
                          {employee.email}
                        </div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-500">
                      {employee.id}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-500">
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800"
                    >
                      {employee.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {employee.reportTo}
                  </td>
                  <td className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedEmployees.length > 0 && (
                <span>
                  {selectedEmployees.length} of {filteredEmployees.length}{" "}
                  row(s) selected.
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Page 1 of 1</span>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
