import { useEffect, useState } from 'react'
import { ArrowUp, MessageCircle } from 'lucide-react'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }
  const handleScrollToComment = () => {
    document.getElementById('comment').scrollIntoView()
  }
  return (
    <div
      className={`fixed bottom-8 right-8 hidden flex-col gap-3 ${show ? 'md:flex' : 'md:hidden'}`}
    >
      <button
        aria-label="Scroll To Comment"
        type="button"
        onClick={handleScrollToComment}
        className="rounded-full border border-gray-200 bg-white/90 p-3 text-gray-500 shadow-lg backdrop-blur transition-colors hover:text-primary-500 dark:border-gray-700/60 dark:bg-gray-800/90 dark:text-gray-400 dark:hover:text-primary-400"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        aria-label="Scroll To Top"
        type="button"
        onClick={handleScrollTop}
        className="rounded-full bg-primary-600/90 p-3 text-white shadow-lg transition-colors hover:bg-primary-500 dark:bg-primary-700/90"
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default ScrollTopAndComment
