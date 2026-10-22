import Link from '@/components/Link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  totalPages: number
  currentPage: number
}

export default function Pagination({ totalPages, currentPage }: Props) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav aria-label="Pagination" className="flex items-center justify-center space-x-4">
        {!prevPage && (
          <button
            disabled={!prevPage}
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-400 opacity-50 dark:border-gray-700 dark:text-gray-600"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/blog/` : `/blog/page/${currentPage - 1}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-primary-400 hover:text-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:text-primary-400"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            Previous
          </Link>
        )}
        <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            disabled={!nextPage}
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-400 opacity-50 dark:border-gray-700 dark:text-gray-600"
          >
            Next
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
        {nextPage && (
          <Link
            href={`/blog/page/${currentPage + 1}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-primary-400 hover:text-primary-500 dark:border-gray-700 dark:text-gray-300 dark:hover:text-primary-400"
          >
            Next
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        )}
      </nav>
    </div>
  )
}
