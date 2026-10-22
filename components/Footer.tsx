import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-4 flex max-w-full flex-wrap items-center justify-center gap-3">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} boxed />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} boxed />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} boxed />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} boxed />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} boxed />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} boxed />
        </div>
        <div className="mb-2 flex max-w-full flex-wrap items-center justify-center gap-x-2 px-2 text-center text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
      </div>
    </footer>
  )
}
