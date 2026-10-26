import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection, getEntry } from 'astro:content'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import satori from 'satori'
import sharp from 'sharp'
import siteMetadata from '../../data/site-metadata'

export const prerender = true

interface CardProps {
  title: string
  summary: string
  author: string
  avatar?: string
  tag?: string
  date: string
}

export const getStaticPaths = (async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.images.length === 0)
  return Promise.all(
    posts.map(async (post) => {
      const author = await getEntry('authors', post.data.authors[0] || 'default')
      return {
        params: { slug: post.id },
        props: {
          title: post.data.title,
          summary: post.data.summary || siteMetadata.description,
          author: author?.data.name || siteMetadata.author,
          avatar: author?.data.avatar,
          tag: post.data.tags[0],
          date: post.data.date.toISOString(),
        },
      }
    })
  )
}) satisfies GetStaticPaths

const fontsDir = join(process.cwd(), 'node_modules/@fontsource/inter/files')
const logoPath = join(process.cwd(), 'src/assets/logo.svg')

async function loadAssets(avatar?: string) {
  const [regular, semibold, logo] = await Promise.all([
    readFile(join(fontsDir, 'inter-latin-400-normal.woff')),
    readFile(join(fontsDir, 'inter-latin-600-normal.woff')),
    readFile(logoPath, 'utf8'),
  ])
  const mark = `data:image/svg+xml;base64,${Buffer.from(logo.replaceAll('currentColor', '#000000')).toString('base64')}`
  const authorImage =
    avatar && !/^https?:\/\//i.test(avatar)
      ? await readFile(join(process.cwd(), 'public', avatar.replace(/^\/+/, '')))
      : undefined
  const avatarFormat = authorImage && (await sharp(authorImage).metadata()).format
  const avatarMimeType =
    avatarFormat === 'svg' ? 'image/svg+xml' : avatarFormat ? `image/${avatarFormat}` : undefined
  return {
    regular,
    semibold,
    mark,
    avatar:
      authorImage &&
      avatarMimeType &&
      `data:${avatarMimeType};base64,${authorImage.toString('base64')}`,
  }
}

export const GET: APIRoute = async ({ props }) => {
  const { title, summary, author, tag, date, avatar } = props as CardProps
  const { regular, semibold, mark, avatar: authorImage } = await loadAssets(avatar)
  const published = new Intl.DateTimeFormat(siteMetadata.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
  const excerpt =
    summary.length > 150 ? `${summary.slice(0, 145).replace(/\s+\S*$/, '')}…` : summary
  const titleSize = title.length > 58 ? 48 : title.length > 42 ? 54 : 62
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '48px 64px 40px',
          backgroundColor: '#ffffff',
          color: '#000000',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '14px' },
                    children: [
                      {
                        type: 'img',
                        props: { src: mark, style: { width: '42px', height: '42px' } },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: 23, fontWeight: 600 },
                          children: 'Code by Mureithi',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: '#0f766e',
                      fontSize: 16,
                      fontWeight: 600,
                      letterSpacing: '0.16em',
                    },
                    children: tag ? tag.toUpperCase() : 'BLOG',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
                paddingTop: '20px',
                paddingBottom: '20px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: titleSize,
                      fontWeight: 600,
                      lineHeight: 1.08,
                      letterSpacing: '-0.04em',
                      maxWidth: '1060px',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      marginTop: '20px',
                      maxWidth: '980px',
                      color: '#525252',
                      fontSize: 24,
                      lineHeight: 1.3,
                    },
                    children: excerpt,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '18px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#525252',
                      fontSize: 18,
                    },
                    children: [
                      ...(authorImage
                        ? [
                            {
                              type: 'img',
                              props: {
                                src: authorImage,
                                style: { width: '36px', height: '36px', borderRadius: '999px' },
                              },
                            },
                          ]
                        : []),
                      { type: 'div', props: { children: author } },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: { style: { color: '#525252', fontSize: 17 }, children: published },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 600,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: semibold, weight: 600, style: 'normal' },
      ],
    }
  )
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
