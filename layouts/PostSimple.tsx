import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import Comments from '@/components/comments'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import Tag from '@/components/Tag'
import { CoreContent } from '@/lib/utils/contentlayer'
import { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import type { Blog } from 'contentlayer/generated'

interface Props {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { slug: string; title: string }
  prev?: { slug: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: Props) {
  const { slug, date, title, tags, readingTime } = content

  return (
    <SectionContainer>
      <BlogSEO url={`${siteMetadata.siteUrl}/blog/${slug}`} {...content} />
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className="space-y-2 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
              <div className="flex items-center justify-center space-x-5 font-mono text-sm text-gray-500 dark:text-gray-400">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="flex items-center">
                    <Calendar aria-hidden="true" className="mr-1.5 h-4 w-4 text-primary-500" />
                    <time dateTime={date}>{formatDate(date)}</time>
                  </dd>
                </dl>
                <dl>
                  <dt className="sr-only">Reading time</dt>
                  <dd className="flex items-center">
                    <Clock aria-hidden="true" className="mr-1.5 h-4 w-4 text-primary-500" />
                    {readingTime.text}
                  </dd>
                </dl>
              </div>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap justify-center pt-1">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              )}
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-dark">{children}</div>
            </div>
            <Comments frontMatter={content} />
            <footer>
              <nav aria-label="Post navigation" className="grid gap-4 pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="group flex flex-col rounded-xl border border-gray-200 p-5 transition-colors duration-200 hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500"
                  >
                    <span className="flex items-center font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <ArrowLeft
                        aria-hidden="true"
                        className="mr-1.5 h-4 w-4 text-primary-500 transition-transform duration-200 group-hover:-translate-x-0.5"
                      />
                      Older Post
                    </span>
                    <span className="mt-2 font-display text-base font-bold leading-6 text-gray-900 transition-colors duration-200 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
                {next ? (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="group flex flex-col rounded-xl border border-gray-200 p-5 text-right transition-colors duration-200 hover:border-primary-400 dark:border-gray-700 dark:hover:border-primary-500 sm:col-start-2"
                  >
                    <span className="flex items-center justify-end font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Newer Post
                      <ArrowRight
                        aria-hidden="true"
                        className="ml-1.5 h-4 w-4 text-primary-500 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="mt-2 font-display text-base font-bold leading-6 text-gray-900 transition-colors duration-200 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
              </nav>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
