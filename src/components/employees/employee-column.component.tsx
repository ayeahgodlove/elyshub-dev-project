import React, { useMemo } from 'react'
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IEmployee } from "@/models/employee.model";
import { MoreVertical } from "lucide-react";
import {
    ColumnDef,
} from "@tanstack/react-table";
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { useEmployee } from "@/hooks/employee.hook";
import { UpdateMode } from "@/models/update-mode.enum";
import { toast } from "sonner";

interface UseEmployeeColumnProps {
  onEdit: (employee: IEmployee) => void;
  onView: (employee: IEmployee) => void;
}

export const useEmployeeColumn = ({ onEdit, onView }: UseEmployeeColumnProps) => {
  const { deleteEmployee } = useEmployee();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState<IEmployee | null>(null);

  const handleDeleteClick = (employee: IEmployee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete.id);
      toast.success("Employee deleted successfully!");
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

    // Define columns
    const columns: ColumnDef<IEmployee>[] = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "name",
                header: "Name",
                cell: ({ row }) => (
                    <div className="flex items-center min-w-[200px]">
                        <img
                            className="h-10 w-10 rounded-full object-cover shrink-0"
                            src={row.original.avatar}
                            alt={row.original.name}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    row.original.name
                                )}&background=e5e5e5&color=666666`;
                            }}
                        />
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                                {row.original.name}
                            </div>
                            <div className="text-sm text-gray-500 md:hidden">
                                {row.original.email}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "id",
                header: "ID",
                cell: ({ row }) => (
                    <div className="text-sm text-gray-500">{row.original.id}</div>
                ),
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => (
                    <div className="text-sm text-gray-500 hidden md:table-cell">
                        {row.original.email}
                    </div>
                ),
            },
            {
                accessorKey: "category",
                header: "Category",
                cell: ({ row }) => (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 whitespace-nowrap">
                        {row.original.category}
                    </Badge>
                ),
            },
            {
                accessorKey: "reportTo",
                header: "Report to",
                cell: ({ row }) => (
                    <div className="text-sm text-gray-900 whitespace-nowrap">
                        {row.original.reportTo}
                    </div>
                ),
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onView(row.original)}>
                                    View details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleDeleteClick(row.original)}
                                    className="text-red-600"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently
                                        delete {employeeToDelete?.name || "this employee"}.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleConfirmDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                ),
            },
        ],
        [onEdit, onView]
    );
    return {
        employeeColumns: columns
    }
}
