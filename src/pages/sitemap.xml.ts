import { getCollection } from 'astro:content'
import siteMetadata from '../data/site-metadata'
import { orderPosts } from '../lib/post-order'

export const prerender = true

export async function GET() {
  const posts = orderPosts(await getCollection('blog', ({ data }) => !data.draft))
  const urls = posts
    .map((post) => `<url><loc>${siteMetadata.siteUrl}/blog/${post.id}</loc></url>`)
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
