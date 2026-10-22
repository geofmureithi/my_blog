import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import PageTitle from '@/components/PageTitle'
import { PageSEO } from '@/components/SEO'
import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <>
      <PageSEO title={`About - ${name}`} description={`About me - ${name}`} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <PageTitle>About</PageTitle>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center pt-8">
            <div className="rounded-full bg-gradient-to-tr from-primary-400 to-emerald-300 p-1">
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-48 w-48 rounded-full border-4 border-white dark:border-gray-900"
              />
            </div>
            <h3 className="pb-2 pt-4 font-display text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
              {name}
            </h3>
            <div className="text-lg text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{company}</div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="twitter" href={twitter} />
            </div>
          </div>
          <div className="prose max-w-none pb-8 pt-8 dark:prose-dark xl:col-span-2">{children}</div>
        </div>
      </div>
    </>
  )
}
