import { create } from "zustand";

interface Event {
  id: string;
  date: Date;
  title: string;
}

interface CalendarStore {
  events: Event[];
  selectedDate: Date | null;
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  setSelectedDate: (date: Date | null) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  selectedDate: null,
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
