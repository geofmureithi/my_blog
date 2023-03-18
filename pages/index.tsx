import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import { sortedBlogPost, allCoreContent } from '@/lib/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import NewsletterForm from '@/components/NewsletterForm'
import { allBlogs } from 'contentlayer/generated'
import Image from 'next/image'

const MAX_DISPLAY = 5

export const getStaticProps = async () => {
  // TODO: move computation to get only the essential frontmatter to contentlayer.config
  const sortedPosts = sortedBlogPost(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return { props: { posts } }
}

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const headingColorClass =
    'bg-gradient-to-r from-green-600 to-red-600 dark:bg-gradient-to-l dark:from-gray-500 dark:to-lime-600'
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-700 md:mt-16">
        <div className="my-4 space-y-2 pt-6 pb-8 md:space-y-5 xl:grid xl:grid-cols-3">
          <div className="pr-8 xl:col-span-2">
            <p
              className={`mb-4 bg-clip-text text-4xl font-extrabold leading-[60px] tracking-tight text-transparent ${headingColorClass} md:text-6xl md:leading-[86px]`}
            >
              Habari!
            </p>

            <div className="text-lg leading-8 text-gray-600 dark:text-gray-400">
              <h1 className="text-neutral-900 dark:text-neutral-200">
                Hey there! I'm <span className="font-medium">Njuguna Mureithi, </span>a{' '}
                <span className="font-medium">Senior Engineer</span> from Nairobi, Kenya.
              </h1>
              <p className="mt-4 mb-8">
                I'm a self-taught developer with over 10 years of professional experience under my belt.
                <br />
                I love coding every chance I get, and I'm always learning new concepts and languages (right now I'm all about Rust and JavaScript, with a bit of C thrown in for good measure). 
                <br />
                When I'm not deep in the code, you can catch me playing some football!
                <br />
                Fun fact: I was even part of the winning team at a hackathon once.
                <br />
                And if you're interested, I also give talks on WASM and Rust.
                <br />
                Let's connect and chat about tech, football, or anything in between!
              </p>
              <p className="my-8">Karibu!</p>
            </div>
          </div>
          <div className="hidden xl:block">
            <Image
              className="rounded object-cover object-center"
              alt="hero"
              layout="responsive"
              width={1280}
              height={960}
              src="/static/images/who-am-i.jpeg"
            />
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            Latest Posts
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
