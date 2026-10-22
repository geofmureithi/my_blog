import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import TOCInline from '@/components/TOCInline'
import siteMetadata from '@/data/siteMetadata'
import Comments from '@/components/comments'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { CoreContent } from '@/lib/utils/contentlayer'
import { ReactNode } from 'react'
import { Calendar, Clock } from 'lucide-react'
import ReadingProgress from '@/components/ReadingProgress'
import type { Toc } from 'types/Toc'
import type { Blog, Authors } from 'contentlayer/generated'

const editUrl = (slug) => `${siteMetadata.siteRepo}/blob/main/data/blog/${slug}`
const discussUrl = (slug) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/blog/${slug}`
  )}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface Props {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { slug: string; title: string }
  prev?: { slug: string; title: string }
  toc?: Toc
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, toc, children }: Props) {
  const { slug, date, title, tags, readingTime } = content

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...content}
      />
      <ScrollTopAndComment />
      <ReadingProgress />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center space-x-5 font-mono text-sm text-gray-500 dark:text-gray-400">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="flex items-center">
                    <Calendar aria-hidden="true" className="mr-1.5 h-4 w-4 text-primary-500" />
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
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
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="space-y-8 pb-10 pt-6 xl:pt-11">
              <dl>
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                    {authorDetails.map((author) => (
                      <li
                        key={author.name}
                        className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/40"
                      >
                        <div className="flex items-center space-x-3">
                          {author.avatar && (
                            <Image
                              src={author.avatar}
                              width={38}
                              height={38}
                              alt="avatar"
                              className="rounded-full"
                            />
                          )}
                          <dl className="whitespace-nowrap text-sm font-medium leading-5">
                            <dt className="sr-only">Name</dt>
                            <dd className="font-display text-gray-900 dark:text-gray-100">
                              {author.name}
                            </dd>
                            {author.occupation && (
                              <>
                                <dt className="sr-only">Occupation</dt>
                                <dd className="text-gray-500 dark:text-gray-400">
                                  {author.occupation}
                                </dd>
                              </>
                            )}
                            <dt className="sr-only">Twitter</dt>
                            <dd>
                              {author.twitter && (
                                <Link
                                  href={author.twitter}
                                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                  {author.twitter.replace('https://twitter.com/', '@')}
                                </Link>
                              )}
                            </dd>
                          </dl>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
              {toc && toc.length > 0 && (
                <aside className="hidden xl:block">
                  <h2 className="font-mono text-sm tracking-wide text-gray-500 [font-variant:small-caps] dark:text-gray-400">
                    Table of contents
                  </h2>
                  <div className="mt-3 border-l-2 border-gray-200 pl-4 text-sm leading-6 text-gray-600 dark:border-gray-700 dark:text-gray-300">
                    <TOCInline toc={toc} toHeading={3} />
                  </div>
                </aside>
              )}
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-dark">{children}</div>
              <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={discussUrl(slug)} rel="nofollow">
                  {'Discuss on Twitter'}
                </Link>
                {` • `}
                <Link href={editUrl(slug)}>{'View on GitHub'}</Link>
              </div>
              <Comments frontMatter={content} />
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/blog/${prev.slug}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/blog/${next.slug}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href="/blog"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
