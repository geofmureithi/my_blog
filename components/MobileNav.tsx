import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import { Menu, X } from 'lucide-react'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const router = useRouter()

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label="Toggle Menu"
        aria-expanded={navShow}
        onClick={onToggleNav}
        className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        {navShow ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {navShow && (
        <>
          <button
            type="button"
            aria-label="Close Menu"
            tabIndex={-1}
            onClick={onToggleNav}
            className="fixed inset-0 z-30 cursor-default bg-gray-900/20 backdrop-blur-sm sm:hidden"
          />
          <nav
            aria-label="Mobile navigation"
            className="fixed inset-x-4 top-20 z-40 animate-fade-in-up rounded-xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur dark:border-gray-700/60 dark:bg-gray-900/95 sm:hidden"
          >
            <ul className="flex flex-col">
              {headerNavLinks.map((link) => {
                const isActive =
                  router.pathname === link.href || router.pathname.startsWith(`${link.href}/`)
                return (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      onClick={onToggleNav}
                      className={`block rounded-lg px-4 py-3 font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                      }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  )
}

export default MobileNav
