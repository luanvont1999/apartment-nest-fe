import {
  Pagination as SPagination,
  PaginationContent,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from './ui/pagination'
import { useMemo } from 'react'

const DOTS = '...'

export default function Pagination({
  page,
  perPage,
  total,
  siblingCount = 1,
  onChange = () => {},
  className = ''
}: {
  page: number
  perPage: number
  total: number
  siblingCount?: number
  onChange?: (value: number) => void
  className?: string
}) {
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
  }

  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(total / perPage)
    const totalPageNumbers = siblingCount + 5

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1)
    const rightSiblingIndex = Math.min(page + siblingCount, totalPageCount)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)

      return [...leftRange, DOTS, totalPageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount)
      return [firstPageIndex, DOTS, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }
  }, [total, perPage, siblingCount, page])

  return (
    <SPagination className={className}>
      <PaginationContent>
        {/* Previous */}
        <PaginationPrevious />

        {/* Body */}
        {paginationRange?.map((item, index) =>
          item === DOTS ? (
            <PaginationEllipsis key={index} />
          ) : (
            <PaginationLink
              key={index}
              className='cursor-pointer'
              onClick={() => onChange(item as number)}
              isActive={page === item}
            >
              {item}
            </PaginationLink>
          )
        )}

        {/* Next */}
        <PaginationNext />
      </PaginationContent>
    </SPagination>
  )
}
