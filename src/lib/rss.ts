import siteMetadata from '../data/site-metadata'

type FeedPost = {
  id: string
  data: {
    title: string
    summary?: string
    date: Date
    tags: string[]
  }
}

const escapeXml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')

export function renderRssFeed(posts: FeedPost[], allPosts: FeedPost[], feedPath: string) {
  const lastBuildDate = new Date(Math.max(...allPosts.map((post) => post.data.date.valueOf())))
  const items = posts
    .map((post) => {
      const url = `${siteMetadata.siteUrl}/blog/${post.id}`
      const categories = post.data.tags.map((tag) => `<category>${escapeXml(tag.toLowerCase())}</category>`).join('')
      return `<item>
<guid>${url}</guid>
<title>${escapeXml(post.data.title)}</title>
<link>${url}</link>
<description>${escapeXml(post.data.summary || '')}</description>
<pubDate>${post.data.date.toUTCString()}</pubDate>
<author>${siteMetadata.email} (${escapeXml(siteMetadata.author)})</author>
${categories}
</item>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>${escapeXml(siteMetadata.title)}</title>
<link>${siteMetadata.siteUrl}/blog</link>
<description>${escapeXml(siteMetadata.description)}</description>
<language>${siteMetadata.language}</language>
<managingEditor>${siteMetadata.email} (${escapeXml(siteMetadata.author)})</managingEditor>
<webMaster>${siteMetadata.email} (${escapeXml(siteMetadata.author)})</webMaster>
<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
<atom:link href="${siteMetadata.siteUrl}${feedPath}" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`
}
