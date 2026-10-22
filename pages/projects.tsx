import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import { PageSEO } from '@/components/SEO'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export default function Projects() {
  return (
    <>
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div>
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="font-display text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Some of the things I have been working on
          </p>
        </div>
        <div className="grid gap-6 py-12 sm:grid-cols-2">
          {projectsData.map((d) => (
            <Link
              key={d.title}
              href={d.href}
              aria-label={d.title}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-800/40 dark:hover:border-primary-700"
            >
              {d.imgSrc && (
                <Image
                  src={d.imgSrc}
                  alt={d.title}
                  width={544}
                  height={306}
                  className="h-44 w-full border-b border-gray-200 object-cover dark:border-gray-700/60"
                />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold leading-snug tracking-tight text-gray-900 dark:text-gray-100">
                    {d.title}
                  </h2>
                  <ArrowUpRight
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-primary-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {d.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
