import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link href={`/tags/${kebabCase(text)}`}>
      <a className="mr-3 inline-flex items-center rounded-md bg-primary-500/10 px-2 py-0.5 font-mono text-xs lowercase text-primary-600 transition-colors hover:bg-primary-500/20 dark:bg-primary-400/10 dark:text-primary-400 dark:hover:bg-primary-400/20">
        #{text.split(' ').join('-')}
      </a>
    </Link>
  )
}

export default Tag
