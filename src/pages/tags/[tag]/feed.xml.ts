import { getCollection } from 'astro:content'
import { orderPosts } from '../../../lib/post-order'
import { renderRssFeed } from '../../../lib/rss'

export const prerender = true

const slugFor = (tag: string) => tag.toLowerCase().replaceAll(' ', '-')

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  const tags = new Set(posts.flatMap((post) => post.data.tags))
  return [...tags].map((tag) => ({ params: { tag: slugFor(tag) } }))
}

export async function GET({ params }: { params: { tag: string } }) {
  const allPosts = orderPosts(await getCollection('blog', ({ data }) => !data.draft))
  const posts = allPosts.filter((post) => post.data.tags.some((tag) => slugFor(tag) === params.tag))
  return new Response(renderRssFeed(posts, allPosts, `/tags/${params.tag}/feed.xml`), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
