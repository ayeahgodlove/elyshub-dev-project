import { create } from "zustand";

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  activePage: string;

  // Modals
  isAddEmployeeModalOpen: boolean;
  isEditEmployeeModalOpen: boolean;
  editingEmployeeId: string | null;

  // User Menu
  showUserMenu: boolean;

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActivePage: (page: string) => void;
  openAddEmployeeModal: () => void;
  closeAddEmployeeModal: () => void;
  openEditEmployeeModal: (id: string) => void;
  closeEditEmployeeModal: () => void;
  toggleUserMenu: () => void;
  setShowUserMenu: (show: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  activePage: "Employees",
  isAddEmployeeModalOpen: false,
  isEditEmployeeModalOpen: false,
  editingEmployeeId: null,
  showUserMenu: false,

  setSidebarCollapsed: (collapsed: boolean) =>
    set({ sidebarCollapsed: collapsed }),
  setActivePage: (page: any) => set({ activePage: page }),
  openAddEmployeeModal: () => set({ isAddEmployeeModalOpen: true }),
  closeAddEmployeeModal: () => set({ isAddEmployeeModalOpen: false }),
  openEditEmployeeModal: (id: string) =>
    set({ isEditEmployeeModalOpen: true, editingEmployeeId: id }),
  closeEditEmployeeModal: () =>
    set({ isEditEmployeeModalOpen: false, editingEmployeeId: null }),
  toggleUserMenu: () =>
    set((state: any) => ({ showUserMenu: !state.showUserMenu })),
  setShowUserMenu: (show: boolean) => set({ showUserMenu: show }),
}));
