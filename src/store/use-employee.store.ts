import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Employee {
  id: string;
  name: string;
  email: string;
  category: string;
  reportTo: string;
  avatar?: string;
}

export interface EmployeeState {
  // State
  employees: Employee[];
  selectedRows: string[];
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  showTutorial: boolean;

  // Actions
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  toggleRowSelection: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setShowTutorial: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      // Initial State
      employees: [
        {
          id: "#28373",
          name: "Olamide Akintan",
          email: "olamideakintan@gmail.com",
          category: "Label",
          reportTo: "Roxanne Justina",
        },
        {
          id: "#32876",
          name: "Alison David",
          email: "alisondavid@gmail.com",
          category: "Label",
          reportTo: "Victor Black",
        },
        {
          id: "#11394",
          name: "Megan Willow",
          email: "meganwillow@gmail.com",
          category: "Label",
          reportTo: "Amaree Savil",
        },
        {
          id: "#99822",
          name: "Janelle Levi",
          email: "janellelevi@gmail.com",
          category: "Label",
          reportTo: "Wilson Qillex",
        },
        {
          id: "#11873",
          name: "King Fisher",
          email: "kingfisher@gmail.com",
          category: "Label",
          reportTo: "Roxanne Justina",
        },
        {
          id: "#33644",
          name: "Olivia Mahun",
          email: "oliviamahun@gmail.com",
          category: "Label",
          reportTo: "Danielle Maxel",
        },
        {
          id: "#00297",
          name: "Vivian Kalu",
          email: "viviankalu@gmail.com",
          category: "Label",
          reportTo: "Alexis Terence",
        },
        {
          id: "#00298",
          name: "Douglas Smith",
          email: "douglassmith@gmail.com",
          category: "Label",
          reportTo: "Zahill Christian",
        },
        {
          id: "#00299",
          name: "Kenneth Tarry",
          email: "kennethtarry@gmail.com",
          category: "Label",
          reportTo: "Roxanne Justina",
        },
      ],
      selectedRows: [],
      searchQuery: "",
      currentPage: 1,
      totalPages: 30,
      isLoading: false,
      showTutorial: true,

      // Actions
      setEmployees: (employees) => set({ employees }),

      addEmployee: (employee) =>
        set((state) => ({
          employees: [...state.employees, employee],
        })),

      updateEmployee: (id, updates) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updates } : emp
          ),
        })),

      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
          selectedRows: state.selectedRows.filter((rowId) => rowId !== id),
        })),

      toggleRowSelection: (id) =>
        set((state) => ({
          selectedRows: state.selectedRows.includes(id)
            ? state.selectedRows.filter((rowId) => rowId !== id)
            : [...state.selectedRows, id],
        })),

      toggleSelectAll: () =>
        set((state) => {
          const allSelected =
            state.selectedRows.length === state.employees.length;
          return {
            selectedRows: allSelected
              ? []
              : state.employees.map((emp) => emp.id),
          };
        }),

      clearSelection: () => set({ selectedRows: [] }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setCurrentPage: (page) => set({ currentPage: page }),

      setShowTutorial: (show) => set({ showTutorial: show }),

      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "employee-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        showTutorial: state.showTutorial,
        employees: state.employees,
      }),
    }
  )
);
