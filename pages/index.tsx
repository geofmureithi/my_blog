import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Card from '@/components/Card'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import { sortedBlogPost, allCoreContent } from '@/lib/utils/contentlayer'
import { InferGetStaticPropsType } from 'next'
import NewsletterForm from '@/components/NewsletterForm'
import { allBlogs } from 'contentlayer/generated'
import Image from 'next/image'
import { ArrowRight, Github, Linkedin, Mail, MapPin, Twitter } from 'lucide-react'

const socialButtonClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors duration-200 hover:border-primary-500 hover:bg-primary-500/10 hover:text-primary-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-primary-400 dark:hover:bg-primary-400/10 dark:hover:text-primary-400'

const highlightClass = 'font-semibold text-gray-900 dark:text-gray-100'

const socials = [
  { label: 'GitHub', href: siteMetadata.github, Icon: Github },
  { label: 'Twitter', href: siteMetadata.twitter, Icon: Twitter },
  { label: 'LinkedIn', href: siteMetadata.linkedin, Icon: Linkedin },
]

export const getStaticProps = async () => {
  // TODO: move computation to get only the essential frontmatter to contentlayer.config
  const sortedPosts = sortedBlogPost(allBlogs)
  const posts = allCoreContent(sortedPosts)

  return { props: { posts } }
}

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const latestPosts = posts.slice(0, 4)
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />

      <section className="mt-8 grid items-center gap-10 md:mt-16 xl:grid-cols-2 xl:gap-14">
        <div>
          <p className="inline-flex animate-fade-in-up items-center gap-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-primary-600 dark:border-primary-400/30 dark:bg-primary-400/10 dark:text-primary-400">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Senior Engineer · Nairobi, Kenya
          </p>
          <h1 className="mt-6 animate-fade-in-up font-display text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
            Habari
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              !
            </span>
          </h1>
          <div className="mt-6 space-y-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
            <p>
              I'm <span className={highlightClass}>Njuguna Mureithi</span>, a{' '}
              <span className={highlightClass}>Senior Engineer</span> from Nairobi, Kenya.
            </p>
            <p>
              I started my coding journey in 2007 and sold my first software in 2010. I write code
              every possible day and have done so, gaining 10+ years of real work experience. I
              enjoy learning new concepts and languages — currently a lot of Rust and JavaScript,
              with a little bit of C.
            </p>
            <p className="font-display text-xl font-semibold text-primary-600 dark:text-primary-400">
              Karibu!
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <Link key={label} href={href} aria-label={label} className={socialButtonClass}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
            <a
              href={`mailto:${siteMetadata.email}`}
              aria-label="Email"
              className={socialButtonClass}
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl animate-fade-in-up">
          <div
            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary-400/40 via-primary-500/10 to-primary-600/40 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 p-1 shadow-xl">
            <Image
              alt="Njuguna Mureithi"
              className="h-auto w-full rounded-2xl object-cover"
              height={480}
              src="/static/images/who-am-i.jpeg"
              width={640}
            />
          </div>
        </div>
      </section>

      <section className="mt-16 md:mt-24">
        <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Latest Posts
        </h2>
        <p className="mt-2 text-lg leading-7 text-gray-500 dark:text-gray-400">
          {siteMetadata.description}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {!posts.length && <p className="text-gray-500 dark:text-gray-400">No posts found.</p>}
          {latestPosts.map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <div key={slug}>
                <Card title={title} description={summary} href={`/blog/${slug}`} />
                <div className="mt-3 flex flex-wrap items-center gap-y-2">
                  <time
                    dateTime={date}
                    className="mr-4 font-mono text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    {formatDate(date)}
                  </time>
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {posts.length > latestPosts.length && (
          <div className="mt-8 flex justify-end">
            <Link
              href="/blog"
              aria-label="All posts"
              className="inline-flex items-center gap-1.5 font-medium text-primary-600 transition-colors hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              All Posts
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center py-16">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
