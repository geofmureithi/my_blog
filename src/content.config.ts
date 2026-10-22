import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    lastmod: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    summary: z.string().optional(),
    images: z.array(z.string()).default([]),
    authors: z.array(z.string()).default(['default']),
    canonicalUrl: z.string().url().optional(),
  }),
})

const authors = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    alternateName: z.string().optional(),
    avatar: z.string().optional(),
    occupation: z.string().optional(),
    company: z.string().optional(),
    email: z.string().email().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
  }),
})

export const collections = { blog, authors }
