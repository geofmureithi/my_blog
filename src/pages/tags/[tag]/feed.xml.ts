import { getCollection } from 'astro:content'
import { orderPosts } from '../../../lib/post-order'
import { renderRssFeed } from '../../../lib/rss'
import { tagSlug, uniqueTags } from '../../../lib/tags'

export const prerender = true

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  const tags = uniqueTags(posts.flatMap((post) => post.data.tags))
  return tags.map(({ slug }) => ({ params: { tag: slug } }))
}

export async function GET({ params }: { params: { tag: string } }) {
  const allPosts = orderPosts(await getCollection('blog', ({ data }) => !data.draft))
  const posts = allPosts.filter((post) => post.data.tags.some((tag) => tagSlug(tag) === params.tag))
  return new Response(renderRssFeed(posts, allPosts, `/tags/${params.tag}/feed.xml`), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
