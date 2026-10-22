import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { FileQuestion, Home } from 'lucide-react'

export default function FourZeroFour() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex animate-fade-in-up flex-col items-center">
        <FileQuestion aria-hidden="true" className="h-16 w-16 text-primary-500" />
        <h1 className="mt-6 font-display text-6xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-100 md:text-8xl">
          404
        </h1>
        <p className="mt-6 text-xl font-bold leading-normal text-gray-900 dark:text-gray-100 md:text-2xl">
          Sorry we couldn't find this page.
        </p>
        <p className="mb-8 mt-2 max-w-md text-gray-500 dark:text-gray-400">
          But don't worry, you can find plenty of other things on {siteMetadata.title}.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium leading-5 text-white shadow-sm transition-colors duration-200 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <Home aria-hidden="true" className="h-4 w-4" />
          Back home
        </Link>
      </div>
    </div>
  )
}
