"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APPOINTMENTS } from "@/data/appointment.data";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ListFilter, Plus, Calendar as CalendarIcon, Divide, List, Search } from "lucide-react";
import { ButtonGroup } from "./ui/button-group";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 8 }, (_, i) => 8 + i);
const DATES = [12, 13, 14, 15, 16, 17, 18];

export function DashboardCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const [viewType, setViewType] = useState<"day" | "week" | "month" | "year">(
    "week"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const filteredAppointments = APPOINTMENTS.filter(
    (apt) =>
      apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.participants.includes(searchQuery)
  );

  const getAppointmentsForSlot = (day: number, hour: number) => {
    return filteredAppointments.filter(
      (apt) => apt.day === day && apt.startHour === hour
    );
  };

  return (
    <>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Appointments</h2>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-lg">
          <Plus className="w-4 h-4" />
          New Appointment
        </Button>
      </div>


      <Card className="w-full border p-0">
        <CardHeader>
          {/* Calendar Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ButtonGroup>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="w-6 h-6" />
                </Button>
                <Button variant="outline" size="sm">
                  <List className="w-6 h-6" />
                </Button>
              </ButtonGroup>
              <Button variant="outline" size="sm">
                Today
              </Button>
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground ml-2">
                July, 2023
              </span>
            </div>

            <div className="flex gap-2">
              <ButtonGroup>
                <Button
                  variant={viewType === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewType("day")}
                >
                  Day
                </Button>
                <Button
                  variant={viewType === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewType("week")}
                >
                  Week
                </Button>
                <Button
                  variant={viewType === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewType("month")}
                >
                  Month
                </Button>
                <Button
                  variant={viewType === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewType("year")}
                >
                  Year
                </Button>
              </ButtonGroup>

              <Button variant="outline" size="sm">
                <ListFilter className="w-6 h-6" />
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Day Headers */}
              <div className="flex border-b border-border">
                <div className="w-24 bg-secondary/50 px-4 py-4 border-r border-border">
                  <div className="text-xs font-semibold text-muted-foreground">
                    PST
                  </div>
                </div>
                {DAYS.map((day, idx) => (
                  <div
                    key={day}
                    className="flex-1 min-w-32 bg-secondary/30 px-4 py-4 border-r border-border text-center"
                  >
                    <div className="text-xs font-semibold text-foreground">
                      {DATES[idx]} {day}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {day === "Today" ? "Today" : ""}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {HOURS.map((hour) => (
                <div key={hour} className="flex border-b border-border min-h-24">
                  {/* Time Label */}
                  <div className="w-24 bg-secondary/10 px-4 py-2 border-r border-border flex items-start">
                    <span className="text-xs font-medium text-muted-foreground">
                      {hour}:00
                    </span>
                  </div>

                  {/* Day Columns */}
                  {DAYS.map((_, dayIdx) => (
                    <div
                      key={`${dayIdx}-${hour}`}
                      className="flex-1 min-w-32 border-r border-border bg-background relative p-1 hover:bg-secondary/10 transition-colors"
                    >
                      {/* Appointments for this slot */}
                      {getAppointmentsForSlot(dayIdx, hour).map((apt) => (
                        <div
                          key={apt.id}
                          className={`${apt.color} rounded-md p-2 mb-1 text-xs cursor-pointer hover:shadow-md transition-shadow`}
                        >
                          <div className="font-semibold text-foreground truncate">
                            {apt.title}
                          </div>
                          <div className="text-foreground/70 text-xs mt-1">
                            {apt.time}
                          </div>
                          <div className="text-foreground/60 text-xs mt-1 truncate">
                            {apt.location}
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs text-foreground/70">
                              👥 {apt.participants}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent >
      </Card >
    </>
  );
}
