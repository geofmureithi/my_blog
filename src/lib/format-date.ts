import siteMetadata from '../data/site-metadata'

export function formatDate(date: Date, withWeekday = false) {
  return new Intl.DateTimeFormat(siteMetadata.locale, {
    ...(withWeekday ? { weekday: 'long' as const } : {}),
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
