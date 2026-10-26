import { getCollection } from 'astro:content'
import siteMetadata from '../data/site-metadata'
import { orderPosts } from '../lib/post-order'
import { uniqueTags } from '../lib/tags'

export const prerender = true

interface SitemapUrl {
  loc: string
  lastmod?: Date
}

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

export async function GET() {
  const posts = orderPosts(await getCollection('blog', ({ data }) => !data.draft))
  const siteOrigin = new URL(siteMetadata.siteUrl).origin
  const pageUrls: SitemapUrl[] = ['/', '/about', '/blog', '/projects', '/tags'].map((path) => ({
    loc: `${siteMetadata.siteUrl}${path}`,
  }))
  const tags = uniqueTags(posts.flatMap((post) => post.data.tags))
  const tagUrls: SitemapUrl[] = tags.map(({ slug }) => ({
    loc: `${siteMetadata.siteUrl}/tags/${slug}`,
  }))
  const postUrls: SitemapUrl[] = posts.flatMap((post) => {
    const loc = post.data.canonicalUrl || `${siteMetadata.siteUrl}/blog/${post.id}`
    if (new URL(loc).origin !== siteOrigin) return []
    return [{ loc, lastmod: post.data.lastmod }]
  })
  const urls = [...pageUrls, ...tagUrls, ...postUrls]
    .map(
      ({ loc, lastmod }) =>
        `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ''}</url>`
    )
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
