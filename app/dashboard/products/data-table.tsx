"use client"
 
import {
  ColumnDef,
  ColumnFilter,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronsRightIcon } from "lucide-react"
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
 
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting,setSorting] = useState<SortingState>([])
  const [columnFilters,setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel:getPaginationRowModel(),
    getFilteredRowModel:getFilteredRowModel(),
    onColumnFiltersChange:setColumnFilters,
    state:{
      sorting,
      columnFilters,
    }
  })

  return (
    <div className="rounded-md border">
      <Card>
        <CardHeader>
          <CardTitle>你的产品</CardTitle>
          <CardDescription>更新，删除并编辑你的产品⭐</CardDescription>
        </CardHeader>
        <CardContent>
        <div>
          <Input placeholder="产品过滤" 
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)
        }
        />
        <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
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
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                无结果
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button 
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()} 
        variant="outline">
          <ChevronLeftIcon className="w-4 h-4" />
          <span>上一页</span>
        </Button>
        <Button 
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()} 
        variant="outline">
          <ChevronsRightIcon  className="w-4 h-4" />
          <span>下一页</span>
        </Button>
      </div>
      </div>
        </CardContent>
      </Card>
    </div>
  )
}