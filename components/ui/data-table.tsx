"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Loading } from "./loading";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    title: string;
    render?: (item: T) => React.ReactNode;
    filterable?: boolean;
  }[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  sortable?: boolean;
  bulkActions?: {
    label: string;
    action: (selectedItems: T[]) => void;
  }[];
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading,
  onRowClick,
  searchable = true,
  sortable = true,
  bulkActions = [],
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({ key: "", direction: null });
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {}
  );

  // Filter data based on search query and column filters
  const filteredData = data.filter((item) => {
    // Global search
    const matchesSearch = Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Column filters
    const matchesFilters = Object.entries(columnFilters).every(
      ([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase().includes(value.toLowerCase());
      }
    );

    return matchesSearch && matchesFilters;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.direction || !sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (key: string) => {
    if (!sortable) return;

    setSortConfig((current) => ({
      key,
      direction:
        current.key === key
          ? current.direction === "asc"
            ? "desc"
            : current.direction === "desc"
            ? null
            : "asc"
          : "asc",
    }));
  };

  const getSortIcon = (key: string) => {
    if (!sortable) return null;
    if (sortConfig.key !== key) return <ChevronsUpDown className="h-4 w-4" />;
    if (sortConfig.direction === "asc")
      return <ChevronUp className="h-4 w-4" />;
    if (sortConfig.direction === "desc")
      return <ChevronDown className="h-4 w-4" />;
    return <ChevronsUpDown className="h-4 w-4" />;
  };

  const handleSelectItem = (item: T) => {
    setSelectedItems((current) => {
      const isSelected = current.some((i) => i === item);
      if (isSelected) {
        return current.filter((i) => i !== item);
      }
      return [...current, item];
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData);
    }
  };

  const handleColumnFilter = (key: string, value: string) => {
    setColumnFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        )}

        {bulkActions.length > 0 && selectedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {bulkActions.map((action) => (
                  <DropdownMenuItem
                    key={action.label}
                    onClick={() => action.action(selectedItems)}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {bulkActions.length > 0 && (
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length > 0 &&
                      selectedItems.length === filteredData.length
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4"
                    title="Select all items"
                    aria-label="Select all items"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead key={column.key}>
                  <div className="space-y-2">
                    {sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key)}
                        className="h-8 p-0 font-medium"
                      >
                        {column.title}
                        {getSortIcon(column.key)}
                      </Button>
                    ) : (
                      column.title
                    )}
                    {column.filterable && (
                      <Input
                        placeholder={`Filter ${column.title.toLowerCase()}...`}
                        value={columnFilters[column.key] || ""}
                        onChange={(e) =>
                          handleColumnFilter(column.key, e.target.value)
                        }
                        className="h-8 text-sm"
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((item, index) => (
                <TableRow
                  key={index}
                  className={`${
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  } ${selectedItems.includes(item) ? "bg-muted/50" : ""}`}
                >
                  {bulkActions.length > 0 && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => handleSelectItem(item)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4"
                        title={`Select ${Object.values(item)[0]}`}
                        aria-label={`Select ${Object.values(item)[0]}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      onClick={() => onRowClick?.(item)}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
