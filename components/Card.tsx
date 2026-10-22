import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
}

const Card = ({ title, description, imgSrc, href }: CardProps) => {
  const cardClass =
    'group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-800/40 dark:hover:border-primary-700'

  const content = (
    <>
      {imgSrc && (
        <Image
          alt={title}
          src={imgSrc}
          width={544}
          height={306}
          className="mb-4 h-48 w-full rounded-lg object-cover"
        />
      )}
      <h2 className="font-display text-lg font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
        {title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </>
  )

  if (href) {
    return (
      <Link href={href} aria-label={`Link to ${title}`} className={cardClass}>
        {content}
      </Link>
    )
  }

  return <div className={cardClass}>{content}</div>
}

export default Card
