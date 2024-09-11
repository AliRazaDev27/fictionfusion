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
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  function getPath(page){
    let url =  path+"?page="+page
    if(search) url += "&search="+search
    if(sort) url += "&sort="+sort
    return url
  }

  
  function getPreviousPage() {
    if (page > 1) {
      return getPath(page - 1)

    }
  }
  function getNextPage() {
    if (page < count / limit) {
      return getPath(page + 1)
    }
  }
  function getPageAt(pageNumber: number) {
    return getPath(pageNumber)
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className={clsx({ hidden: page === 1 })}>
          <PaginationPrevious href={getPreviousPage()} className="bg-white/60" />
        </PaginationItem>
        <PaginationItem className={clsx({ hidden: page === 1 })}>
          <PaginationLink href={getPageAt(page - 1)} className="bg-white/60">{page - 1}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className={clsx({ hidden: page >= count / limit })}>
          <PaginationLink href={getPageAt(page + 1)} className="bg-white/60">{page + 1}</PaginationLink>
        </PaginationItem>
        <PaginationItem className={clsx({ hidden: page >= count / limit })}>
          <PaginationNext href={getNextPage()} className="bg-white/60" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}