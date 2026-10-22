import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import { Github, Linkedin, Mail, Rss, Twitter } from 'lucide-react'

const socialLinks = [
  { label: 'Email', href: `mailto:${siteMetadata.email}`, Icon: Mail, external: false },
  { label: 'GitHub', href: siteMetadata.github, Icon: Github, external: true },
  { label: 'Twitter', href: siteMetadata.twitter, Icon: Twitter, external: true },
  { label: 'LinkedIn', href: siteMetadata.linkedin, Icon: Linkedin, external: true },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 pt-8 dark:border-gray-700/60">
      <div className="flex flex-col items-center pb-10">
        <div className="flex items-center space-x-5">
          {socialLinks.map(({ label, href, Icon, external }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </Link>
          ))}
          <Link
            href="/feed.xml"
            aria-label="RSS Feed"
            className="text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
          >
            <Rss className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-6 font-mono text-xs text-gray-500 dark:text-gray-400">
          {siteMetadata.author} © {new Date().getFullYear()} •{' '}
          <Link
            href="/"
            className="transition-colors hover:text-primary-500 dark:hover:text-primary-400"
          >
            {siteMetadata.title}
          </Link>
        </p>
        <p className="mt-2 font-mono text-xs text-gray-400 dark:text-gray-500">
          Built with Next.js &amp; Tailwind CSS
        </p>
      </div>
    </footer>
  )
}
