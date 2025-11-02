"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Plus,
  Calendar as CalendarIcon,
  List,
  Search,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppointment } from "@/hooks/appointment.hook";
import { useEmployee } from "@/hooks/employee.hook";
import { AppointmentForm } from "@/components/appointments/appointment-form.component";
import { IEmployee } from "@/models/employee.model";
import { UpdateMode } from "@/models/update-mode.enum";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const HOURS = Array.from({ length: 10 }, (_, i) => 8 + i);

type ViewType = "day" | "week" | "month" | "year";
type FilterType = "all" | "meeting" | "consultation" | "appointment";

export function DashboardCalendar() {
  const [viewType, setViewType] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(new Date(2023, 6, 15)); // July 15, 2023
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);

  const { appointments, setUpdateMode } = useAppointment();
  const { employees } = useEmployee();

  const departments = useMemo(() => {
    const depts = new Set(employees.map((emp) => emp.department));
    return ["all", ...Array.from(depts)];
  }, [employees]);

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date(2023, 6, 15)); // Fixed to July 15, 2023 for demo
  };

  // Get employee info from participant IDs
  const getEmployeeInfo = (participantIds: string[]): IEmployee[] => {
    return participantIds
      .map((id) => {
        return employees.find((emp) => emp.id === id);
      })
      .filter((emp): emp is IEmployee => emp !== undefined);
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesSearch =
        searchQuery === "" ||
        apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.participants.some((p) => {
          const employee = employees.find((emp) => emp.id === p);
          return (
            employee &&
            (employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              employee.email.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        });

      const matchesType = filterType === "all" || apt.type === filterType;

      const matchesDepartment =
        selectedDepartment === "all" ||
        apt.participants.some((p) => {
          const employee = employees.find((emp) => emp.id === p);
          return employee && employee.department === selectedDepartment;
        });

      return matchesSearch && matchesType && matchesDepartment;
    });
  }, [searchQuery, filterType, selectedDepartment, appointments, employees]);

  const getAppointmentsForSlot = (day: number, hour: number) => {
    if (viewType === "day") {
      const currentDayOfWeek = currentDate.getDay();
      const adjustedDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
      if (day !== 0) return []; // Only show first column in day view
      return filteredAppointments.filter(
        (apt) => apt.day === adjustedDay && apt.startHour === hour
      );
    }

    return filteredAppointments.filter(
      (apt) => apt.day === day && apt.startHour === hour
    );
  };

  const getDisplayColumns = () => {
    switch (viewType) {
      case "day":
        const dayIndex = currentDate.getDay();
        const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        return [
          {
            date: currentDate.getDate(),
            dayName: DAYS[adjustedDayIndex],
            isToday: currentDate.getDate() === 15,
          },
        ];
      case "week":
        return weekDates.map((date, idx) => ({
          date: date.getDate(),
          dayName: DAYS[idx],
          isToday: date.getDate() === 15 && date.getMonth() === 6,
        }));
      default:
        // For month and year views, default to week for now
        return weekDates.map((date, idx) => ({
          date: date.getDate(),
          dayName: DAYS[idx],
          isToday: date.getDate() === 15 && date.getMonth() === 6,
        }));
    }
  };

  const displayColumns = getDisplayColumns();

  // Format date display
  const getDateDisplay = () => {
    const month = MONTHS[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    switch (viewType) {
      case "day":
        return `${month} ${currentDate.getDate()}, ${year}`;
      case "week":
        const weekStart = weekDates[0];
        const weekEnd = weekDates[6];
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${
            MONTHS[weekStart.getMonth()]
          } ${weekStart.getDate()}-${weekEnd.getDate()}, ${year}`;
        } else {
          return `${MONTHS[weekStart.getMonth()]} ${weekStart.getDate()} - ${
            MONTHS[weekEnd.getMonth()]
          } ${weekEnd.getDate()}, ${year}`;
        }
      case "month":
        return `${month}, ${year}`;
      case "year":
        return `${year}`;
      default:
        return `${month}, ${year}`;
    }
  };

  return (
    <div className="w-full h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6 pt-6">
        <h1 className="text-lg md:text-3xl font-bold text-foreground">
          Appointments
        </h1>
        <Button
          onClick={() => {
            setUpdateMode(UpdateMode.NONE);
            setIsAppointmentFormOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden md:block">New Appointment</span>
        </Button>
      </div>

      <Card className="mx-6 border shadow-sm bg-transparent">
        <CardHeader className="pb-3">
          {/* Calendar Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
            {/* Left controls - First row on mobile */}
            <div className="flex items-center gap-2 justify-between lg:justify-start">
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none rounded-l-md"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none rounded-r-md border-l"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Today button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 hidden sm:flex"
                  onClick={goToToday}
                >
                  Today
                </Button>

                {/* Navigation arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={navigatePrevious}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={navigateNext}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Month/Year display - shows on mobile right side */}
              <span className="hidden md:text-lg font-semibold text-foreground sm:ml-2">
                {getDateDisplay()}
              </span>
            </div>

            {/* Right controls - Second row on mobile */}
            <div className="flex items-center gap-2 justify-between lg:justify-end">
              {/* Today button - visible on mobile only here */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 flex sm:hidden"
                onClick={goToToday}
              >
                Today
              </Button>

              {/* View type selector - responsive width */}
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewType === "day" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("day")}
                  className="h-8 px-2 sm:px-3 rounded-none rounded-l-md text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Day</span>
                  <span className="sm:hidden">D</span>
                </Button>
                <Button
                  variant={viewType === "week" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("week")}
                  className="h-8 px-2 sm:px-3 rounded-none border-l text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Week</span>
                  <span className="sm:hidden">W</span>
                </Button>
                <Button
                  variant={viewType === "month" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("month")}
                  className="h-8 px-2 sm:px-3 rounded-none border-l text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Month</span>
                  <span className="sm:hidden">M</span>
                </Button>
                <Button
                  variant={viewType === "year" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("year")}
                  className="h-8 px-2 sm:px-3 rounded-none rounded-r-md border-l text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Year</span>
                  <span className="sm:hidden">Y</span>
                </Button>
              </div>

              {/* Filter and Search buttons grouped */}
              <div className="flex items-center gap-1">
                {/* Filter button */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <ListFilter className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">
                        Filter Appointments
                      </h4>

                      {/* Type filter */}
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">
                          Type
                        </label>
                        <Select
                          value={filterType}
                          onValueChange={(value: FilterType) =>
                            setFilterType(value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="meeting">Meetings</SelectItem>
                            <SelectItem value="consultation">
                              Consultations
                            </SelectItem>
                            <SelectItem value="appointment">
                              Appointments
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Department filter */}
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">
                          Department
                        </label>
                        <Select
                          value={selectedDepartment}
                          onValueChange={setSelectedDepartment}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept || "all"}>
                                {dept === "all" ? "All Departments" : dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reset filters */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setFilterType("all");
                          setSelectedDepartment("all");
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search button */}
                <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Search className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search appointments, participants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSearchQuery("")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {(filterType !== "all" ||
            selectedDepartment !== "all" ||
            searchQuery) && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">
                Active filters:
              </span>
              {filterType !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Type: {filterType}
                </Badge>
              )}
              {selectedDepartment !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Dept: {selectedDepartment}
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: {searchQuery}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0 overflow-hidden">
          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Day Headers */}
              <thead>
                <tr>
                  <th className="w-20 bg-gray-50 px-3 py-3 border-r border-b text-left">
                    <div className="text-xs font-medium text-gray-500">PST</div>
                  </th>
                  {displayColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className={cn(
                        "min-w-[160px] px-3 py-3 border-r border-b text-center bg-gray-50",
                        col.isToday && "bg-orange-50"
                      )}
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {col.date} {col.dayName}
                      </div>
                      {col.isToday && (
                        <div className="text-xs text-orange-500 font-medium mt-1">
                          Today
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Time Slots */}
              <tbody>
                {HOURS.map((hour) => (
                  <tr key={hour}>
                    {/* Time Label */}
                    <td className="w-20 bg-gray-50 px-3 py-2 border-r border-b align-top">
                      <span className="text-xs text-gray-500">{hour}:00</span>
                    </td>

                    {/* Day Columns */}
                    {displayColumns.map((col, dayIdx) => {
                      const appointments = getAppointmentsForSlot(
                        viewType === "day" ? 0 : dayIdx,
                        hour
                      );

                      return (
                        <td
                          key={`${dayIdx}-${hour}`}
                          className={cn(
                            "min-w-[160px] h-28 border-r border-b p-1 align-top relative",
                            col.isToday && "bg-orange-50/30"
                          )}
                        >
                          {/* Appointments for this slot */}
                          <div className="space-y-1">
                            {appointments.map((apt) => {
                              const participantEmployees = getEmployeeInfo(
                                apt.participants
                              );

                              // Define color classes based on appointment colors
                              const colorClasses = {
                                "bg-blue-100 border-l-4 border-blue-400":
                                  "bg-blue-50 border-l-4 border-blue-400 text-blue-900",
                                "bg-green-100 border-l-4 border-green-400":
                                  "bg-green-50 border-l-4 border-green-400 text-green-900",
                                "bg-orange-100 border-l-4 border-orange-400":
                                  "bg-orange-50 border-l-4 border-orange-400 text-orange-900",
                                "bg-pink-100 border-l-4 border-pink-400":
                                  "bg-pink-50 border-l-4 border-pink-400 text-pink-900",
                                "bg-purple-100 border-l-4 border-purple-400":
                                  "bg-purple-50 border-l-4 border-purple-400 text-purple-900",
                              };

                              return (
                                <div
                                  key={apt.id}
                                  className={cn(
                                    "rounded-md p-2 cursor-pointer hover:shadow-md transition-shadow group",
                                    colorClasses[
                                      apt.color as keyof typeof colorClasses
                                    ] || apt.color
                                  )}
                                  title={`${apt.title}\n${apt.description}`}
                                >
                                  <div className="font-medium text-xs truncate">
                                    {apt.title}
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3 opacity-70" />
                                    <span className="text-[10px] opacity-70">
                                      {apt.time}
                                    </span>
                                  </div>
                                  {apt.location && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <MapPin className="w-3 h-3 opacity-60" />
                                      <span className="text-[10px] opacity-60 truncate">
                                        {apt.location}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 mt-1.5">
                                    {/* Employee avatars */}
                                    <div className="flex -space-x-1">
                                      {participantEmployees
                                        .slice(0, 3)
                                        .map((employee) => (
                                          <Avatar
                                            key={employee.id}
                                            className="w-5 h-5 border-2 border-white"
                                          >
                                            <AvatarImage
                                              src={employee.avatar}
                                              alt={employee.name}
                                              className="object-cover"
                                            />
                                            <AvatarFallback className="text-[8px]">
                                              {employee.name
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                      {participantEmployees.length > 3 && (
                                        <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center">
                                          <span className="text-[8px] font-medium">
                                            +{participantEmployees.length - 3}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    {/* Participant IDs */}
                                    <span className="text-[9px] opacity-70 ml-1">
                                      {apt.participants.slice(0, 2).join(", ")}
                                      {apt.participants.length > 2 && "..."}
                                    </span>
                                  </div>

                                  {/* Hover tooltip with more info */}
                                  <div className="hidden group-hover:block absolute z-10 bg-white p-2 rounded-md shadow-lg border mt-1 min-w-[200px]">
                                    <div className="text-xs font-medium mb-1">
                                      {apt.title}
                                    </div>
                                    <div className="text-[10px] text-gray-600 space-y-0.5">
                                      <div>Type: {apt.type}</div>
                                      <div>Status: {apt.status}</div>
                                      <div>Participants:</div>
                                      <div className="ml-2">
                                        {participantEmployees.map((emp) => (
                                          <div key={emp.id}>
                                            • {emp.name} ({emp.department})
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Month View Grid (when month view is selected) */}
          {viewType === "month" && (
            <div className="p-4">
              <div className="text-center text-muted-foreground">
                <p>
                  Month view calendar grid - showing{" "}
                  {filteredAppointments.length} appointments
                </p>
              </div>
            </div>
          )}

          {/* Year View (when year view is selected) */}
          {viewType === "year" && (
            <div className="p-4">
              <div className="text-center text-muted-foreground">
                <p>
                  Year view - showing all months of {currentDate.getFullYear()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status bar */}
      <div className="mx-6 mt-4 text-xs text-muted-foreground">
        Showing {filteredAppointments.length} of {appointments.length}{" "}
        appointments
      </div>

      {/* Appointment Form Modal */}
      <AppointmentForm
        open={isAppointmentFormOpen}
        onOpenChange={setIsAppointmentFormOpen}
      />
    </div>
  );
}
