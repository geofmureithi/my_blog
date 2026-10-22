import React, { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from 'lucide-react'

import siteMetadata from '@/data/siteMetadata'

const NewsletterForm = ({ title = 'Subscribe to the newsletter' }) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/${siteMetadata.newsletter.provider}`, {
        body: JSON.stringify({
          email: inputEl.current.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const { error } = await res.json()
      if (error) {
        setError(true)
        setMessage('Your e-mail address is invalid or you are already subscribed!')
        return
      }

      inputEl.current.value = ''
      setError(false)
      setSubscribed(true)
      setMessage('Successfully! 🎉 You are now subscribed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl">
      <h2 className="font-display text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={subscribe}>
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="email-input">
            Email address
          </label>
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 bg-gray-100/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100 dark:placeholder-gray-400"
            id="email-input"
            name="email"
            placeholder={subscribed ? "You're subscribed !  🎉" : 'Enter your email'}
            ref={inputEl}
            required
            type="email"
            disabled={subscribed}
          />
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-default disabled:opacity-70 dark:focus:ring-offset-gray-900"
          type="submit"
          disabled={subscribed || loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Subscribing…
            </>
          ) : subscribed ? (
            <>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Thank you!
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Subscribe
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {message}
        </div>
      )}
    </div>
  )
}

export default NewsletterForm

export const BlogNewsletterForm = ({ title }) => (
  <div className="flex items-center justify-center">
    <div className="w-full rounded-xl border border-gray-200 bg-gray-100 p-6 dark:border-gray-700/60 dark:bg-gray-800/50 sm:px-14 sm:py-8">
      <NewsletterForm title={title} />
    </div>
  </div>
)
