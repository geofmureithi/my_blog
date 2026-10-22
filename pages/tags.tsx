import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import kebabCase from '@/lib/utils/kebabCase'
import { getAllTags } from '@/lib/utils/contentlayer'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { allBlogs } from 'contentlayer/generated'

// TODO: refactor into contentlayer once compute over all docs is enabled

export const getStaticProps: GetStaticProps<{ tags: Record<string, number> }> = async () => {
  const tags = await getAllTags(allBlogs)

  return { props: { tags } }
}

export default function Tags({ tags }: InferGetStaticPropsType<typeof getStaticProps>) {
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])
  return (
    <>
      <PageSEO title={`Tags - ${siteMetadata.author}`} description="Things I blog about" />
      <div className="space-y-2 pb-8 pt-6 md:mt-24 md:space-y-5">
        <PageTitle>Tags</PageTitle>
      </div>
      <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 md:grid-cols-3">
        {Object.keys(tags).length === 0 && (
          <p className="font-mono text-sm text-gray-500 dark:text-gray-400 sm:col-span-2 md:col-span-3">
            No tags found.
          </p>
        )}
        {sortedTags.map((t) => (
          <Link
            key={t}
            href={`/tags/${kebabCase(t)}`}
            className="group flex items-center justify-between rounded-xl border border-gray-200 p-4 transition-colors duration-200 hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500"
          >
            <span className="font-mono text-sm lowercase text-primary-500 transition-colors duration-200 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {t.toLowerCase()}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {tags[t]}
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
