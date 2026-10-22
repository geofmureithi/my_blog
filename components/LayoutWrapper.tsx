import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  const router = useRouter()

  return (
    <SectionContainer>
      <div className="flex min-h-screen flex-col justify-between">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 py-4 backdrop-blur transition-colors dark:border-gray-700/60 dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center">
                <div className="mr-3">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 font-display text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:block">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
            <div className="flex items-center text-base leading-5">
              <nav className="hidden sm:block" aria-label="Main navigation">
                <ul className="flex items-center">
                  {headerNavLinks.map((link) => {
                    const isActive =
                      router.pathname === link.href || router.pathname.startsWith(`${link.href}/`)
                    return (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          className={`rounded-md px-3 py-2 font-medium transition-colors ${
                            isActive
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                          }`}
                        >
                          {link.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <ThemeSwitch />
              <MobileNav />
            </div>
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
