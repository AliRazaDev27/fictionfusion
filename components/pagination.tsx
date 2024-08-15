"use client"
import { usePathname, useSearchParams } from "next/navigation"
import clsx from "clsx"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
}
  from "@/components/ui/pagination"
export default function PaginationControll({ count,limit }: { count: number,limit:number }) {
  const path = usePathname()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1;
  function getPreviousPage() {
    if (page > 1) {
      return `${path}?page=${page - 1}`

    }
  }
  function getNextPage() {
    if (page < count / limit) {
      return `${path}?page=${page + 1}`
    }
  }
  function getPageAt(pageNumber: number) {
    return `${path}?page=${pageNumber}`
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className={clsx({ hidden: page === 1 })}>
          <PaginationPrevious href={getPreviousPage()} />
        </PaginationItem>
        <PaginationItem className={clsx({ hidden: page === 1 })}>
          <PaginationLink href={getPageAt(page - 1)}>{page - 1}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className={clsx({ hidden: page === count / limit })}>
          <PaginationLink href={getPageAt(page + 1)}>{page + 1}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={getNextPage()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}