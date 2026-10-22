import { useEffect, useState } from 'react'

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const scrollable =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div aria-hidden="true" className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent">
      <div
        className="h-full origin-left bg-gradient-to-r from-primary-400 to-primary-600 transition-transform duration-75 ease-linear"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

export default ReadingProgress
