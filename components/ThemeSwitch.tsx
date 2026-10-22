import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark' || resolvedTheme === 'dark'

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 sm:ml-3"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {!mounted ? (
        <span className="h-5 w-5" aria-hidden="true" />
      ) : isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  )
}

export default ThemeSwitch
