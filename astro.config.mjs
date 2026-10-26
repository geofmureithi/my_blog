import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import remarkImageDimensions from './src/lib/remark-image-dimensions.mjs'
import rehypePrismMeta from './src/lib/rehype-prism-meta.mjs'

const markdownProcessor = unified({
  remarkPlugins: [remarkImageDimensions],
  rehypePlugins: [
    rehypeSlug,
    rehypeAutolinkHeadings,
    rehypePrismMeta,
    [rehypePrismPlus, { ignoreMissing: true }],
  ],
})

export default defineConfig({
  site: 'https://mureithi.me',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  },
  markdown: {
    syntaxHighlight: false,
    processor: markdownProcessor,
  },
})
