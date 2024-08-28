"use client"
import Link from "next/link"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export function ListTable({data}){
    return(
        <div className="text-white">
        <Table>
          <TableHeader>
            <TableRow className="text-lg hover:bg-dark">
              <TableHead>List Name</TableHead>
              <TableHead>Item Count</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.map((item:any,index:number)=>(
                <TableRow className="hover:bg-sky-900" key={index}>
              <TableCell><Link href={`/lists/${item.id}`}>{item.listName}</Link></TableCell>
              <TableCell>{item.items?.length || 0}</TableCell>
              <TableCell>{item.creator}</TableCell>
              <TableCell>
              <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
    )
}