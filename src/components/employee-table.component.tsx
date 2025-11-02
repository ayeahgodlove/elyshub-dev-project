"use client";
import React, { useMemo, useState } from "react";
import { Search, Plus, Download, Calendar, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useEmployeeColumn } from "./employees/employee-column.component";
import { Badge } from "./ui/badge";
import { useEmployee } from "@/hooks/employee.hook";
import { EmployeeForm } from "@/components/employees/employee-form.component";
import { EmployeeViewDetail } from "@/components/employees/employee-view-detail.component";
import { UpdateMode } from "@/models/update-mode.enum";
import { IEmployee } from "@/models/employee.model";

export function EmployeeTable() {
  const [filterName, setFilterName] = React.useState("");
  const [filterReportTo, setFilterReportTo] = React.useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [isEmployeeViewOpen, setIsEmployeeViewOpen] = useState(false);
  const [selectedEmployeeForView, setSelectedEmployeeForView] = useState<IEmployee | null>(null);
  const { employees, setUpdateMode, setSelectedEmployee } = useEmployee();
  
  const handleEdit = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setUpdateMode(UpdateMode.EDIT);
    setIsEmployeeFormOpen(true);
  };

  const handleView = (employee: IEmployee) => {
    setSelectedEmployeeForView(employee);
    setIsEmployeeViewOpen(true);
  };

  const { employeeColumns } = useEmployeeColumn({
    onEdit: handleEdit,
    onView: handleView,
  });
  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesName =
        !filterName ||
        employee.name.toLowerCase().includes(filterName.toLowerCase()) ||
        employee.email.toLowerCase().includes(filterName.toLowerCase());

      const matchesReportTo =
        !filterReportTo ||
        filterReportTo === "all" ||
        employee.reportTo === filterReportTo;

      return matchesName && matchesReportTo;
    });
  }, [filterName, filterReportTo]);


  // Initialize table
  const table = useReactTable({
    data: filteredEmployees,
    columns: employeeColumns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: (updaterOrValue) => {
      const newSelection =
        typeof updaterOrValue === "function"
          ? updaterOrValue(
            Object.fromEntries(
              selectedEmployees.map((id) => [
                filteredEmployees.findIndex((emp) => emp.id === id),
                true,
              ])
            )
          )
          : updaterOrValue;

      const selectedIds = Object.keys(newSelection)
        .filter((key) => newSelection[key])
        .map((index) => filteredEmployees[parseInt(index)].id);

      setSelectedEmployees(selectedIds);
    },
    state: {
      rowSelection: Object.fromEntries(
        selectedEmployees
          .map((id) => filteredEmployees.findIndex((emp) => emp.id === id))
          .filter((index) => index !== -1)
          .map((index) => [index, true])
      ),
    },
  });

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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterName("");
    setFilterReportTo("all");
  };

  // Get unique managers for filter dropdown
  const uniqueManagers = useMemo(() => {
    return [...new Set(employees.map((e) => e.reportTo))];
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="w-full lg:w-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Employee</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your team members and their account permissions here.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => {
              setUpdateMode(UpdateMode.NONE);
              setIsEmployeeFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search field and Filter button */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </div>

              {/* Filter button - visible on desktop only */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex items-center shrink-0">
                    <ListFilter className="w-4 h-4 mr-2" />
                    Filters
                    {(filterName || filterReportTo !== "all") && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Filter by name..."
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
                          <SelectItem value="all">All Managers</SelectItem>
                          {uniqueManagers.map((manager) => (
                            <SelectItem key={manager} value={manager}>
                              {manager}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(filterName || filterReportTo !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Filter button and Date selector - Mobile/Desktop */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Filter button - visible on mobile only */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex md:hidden items-center shrink-0">
                    <ListFilter className="w-4 h-4 mr-2" />
                    Filters
                    {(filterName || filterReportTo !== "all") && (
                      <span className="ml-1 rounded-full bg-primary w-2 h-2"></span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name-mobile">Name</Label>
                      <Input
                        id="name-mobile"
                        placeholder="Filter by name..."
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
                          <SelectItem value="all">All Managers</SelectItem>
                          {uniqueManagers.map((manager) => (
                            <SelectItem key={manager} value={manager}>
                              {manager}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(filterName || filterReportTo !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Date selector */}
              <Select>
                <SelectTrigger className="w-full md:w-[140px]">
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

          {/* Active Filters Display */}
          {(searchTerm || filterName || filterReportTo !== "all") && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterName && (
                <Badge variant="secondary" className="gap-1">
                  Name: {filterName}
                  <button
                    onClick={() => setFilterName("")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterReportTo !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Report To: {filterReportTo}
                  <button
                    onClick={() => setFilterReportTo("all")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-hidden rounded-md border">
          <div className="overflow-x-auto">
            <Table >
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={
                            header.id === "email"
                              ? "hidden md:table-cell"
                              : ""
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.id === "email"
                              ? "hidden md:table-cell"
                              : cell.column.id === "select"
                                ? "w-12"
                                : cell.column.id === "actions"
                                  ? "w-12"
                                  : ""
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={employeeColumns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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

      {/* Employee Form Modal */}
      <EmployeeForm
        open={isEmployeeFormOpen}
        onOpenChange={(open) => {
          setIsEmployeeFormOpen(open);
          if (!open) {
            setUpdateMode(UpdateMode.NONE);
          }
        }}
      />

      {/* Employee View Detail Modal */}
      <EmployeeViewDetail
        open={isEmployeeViewOpen}
        onOpenChange={setIsEmployeeViewOpen}
        employee={selectedEmployeeForView}
      />
    </div>
  );
}
