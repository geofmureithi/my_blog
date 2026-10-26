import { getCollection } from 'astro:content'
import { orderPosts } from '../lib/post-order'
import { renderRssFeed } from '../lib/rss'

export const prerender = true

export async function GET() {
  const posts = orderPosts(await getCollection('blog', ({ data }) => !data.draft))
  return new Response(renderRssFeed(posts, posts, '/feed.xml'), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
