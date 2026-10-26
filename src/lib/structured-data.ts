import siteMetadata from '../data/site-metadata'

interface AuthorProfile {
  name: string
  alternateName?: string
  avatar?: string
  occupation?: string
  company?: string
  twitter?: string
  linkedin?: string
  github?: string
}

export function personEntity(author: AuthorProfile, authorId = 'default') {
  const url = `${siteMetadata.siteUrl}/about`
  const image = author.avatar && new URL(author.avatar, siteMetadata.siteUrl).href

  return {
    '@type': 'Person',
    '@id': `${url}#person${authorId === 'default' ? '' : `-${encodeURIComponent(authorId)}`}`,
    name: author.name,
    ...(author.alternateName && { alternateName: author.alternateName }),
    url,
    ...(image && { image }),
    ...(author.occupation && { jobTitle: author.occupation }),
    ...(author.company && { worksFor: { '@type': 'Organization', name: author.company } }),
    sameAs: [author.github, author.linkedin, author.twitter].filter((profile): profile is string =>
      Boolean(profile)
    ),
  }
}
