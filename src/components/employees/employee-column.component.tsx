import React, { useMemo } from 'react'
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IEmployee } from "@/models/employee.model";
import { MoreVertical } from "lucide-react";
import {
    ColumnDef,
} from "@tanstack/react-table";
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';

export const useEmployeeColumn = () => {

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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => console.log("row: ", row)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log("row: ", row)}>
                                View details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        []
    );
    return {
        employeeColumns: columns
    }
}
