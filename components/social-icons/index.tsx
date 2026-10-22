import type { SVGProps } from 'react'
import Mail from './mail.svg'
import Github from './github.svg'
import Facebook from './facebook.svg'
import Youtube from './youtube.svg'
import Linkedin from './linkedin.svg'

// Icons taken from: https://simpleicons.org/

export function GardenTwitterFill12(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 12" {...props}>
      {/* Icon from Garden SVG Icons by Zendesk - https://github.com/zendeskgarden/svg-icons/blob/main/LICENSE.md */}
      <path
        fill="currentColor"
        d="M.076 0H3.61l3.145 4.498L10.53 0h1.129L7.185 5.114L12 12H8.468L5.183 7.303L1.128 12H0l4.753-5.312z"
      />
    </svg>
  )
}

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: GardenTwitterFill12,
}

const plainSize = {
  6: 'h-6 w-6',
  8: 'h-8 w-8',
}

const boxedSize = {
  6: { button: 'h-10 w-10', icon: 'h-5 w-5' },
  8: { button: 'h-11 w-11', icon: 'h-6 w-6' },
}

// Mail's artwork sits inside its viewBox, so it looks smaller than the brand marks.
const glyphScale: Record<string, string> = {
  mail: 'scale-[1.67]',
}

const SocialIcon = ({
  kind,
  href,
  size = 8,
  boxed = false,
}: {
  kind: string
  href?: string
  size?: 6 | 8
  boxed?: boolean
}) => {
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href)))
    return null

  const SocialSvg = components[kind]
  const boxedClasses = boxedSize[size]
  const scale = glyphScale[kind] ?? ''

  return (
    <a
      className={
        boxed
          ? `inline-flex ${boxedClasses.button} shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition hover:border-primary-500 hover:text-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none dark:border-gray-600 dark:text-gray-200 dark:hover:border-primary-400 dark:hover:text-primary-400`
          : `inline-flex ${plainSize[size]} items-center justify-center text-gray-700 transition hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400`
      }
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind === 'twitter' ? 'X' : kind}</span>
      <SocialSvg
        className={`fill-current ${boxed ? boxedClasses.icon : 'h-full w-full'} ${scale}`}
      />
    </a>
  )
}

export default SocialIcon
