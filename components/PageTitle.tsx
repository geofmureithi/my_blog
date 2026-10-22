import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl sm:leading-14">
        {children}
      </h1>
      <div aria-hidden="true" className="mt-3">
        <span className="inline-block h-1 w-12 rounded bg-gradient-to-r from-primary-500 to-primary-300" />
      </div>
    </div>
  )
}
