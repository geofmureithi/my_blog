# Code with Mureithi

Personal blog and portfolio for [mureithi.me](https://mureithi.me), built with Astro, MDX, and Tailwind CSS 4. The site renders as static files in `dist/`.

## Requirements

- Node.js 24.22.1 (`.nvmrc`)
- pnpm 12.11.2 (`packageManager` in `package.json`)

## Local development

```sh
pnpm install
pnpm dev
```

Astro prints the local URL when the development server starts.

## Content

Blog posts live in `src/content/blog/`; author records live in `src/content/authors/`. Posts use MDX frontmatter for title, date, tags, summary, images, authors, canonical URL, and draft status. Set `draft: true` to keep a post out of the published site.

Run `pnpm new-post` to create a draft post interactively. Shared site and social metadata lives in `src/data/site-metadata.ts`.

## SEO and feeds

Each page gets a canonical URL, Open Graph and X card metadata. Posts also include Article JSON-LD; the author record supplies the Person data. A post image from its frontmatter is used for social previews. Posts without one get a prerendered card at `/og/<slug>.png`.

The build generates `/robots.txt`, `/sitemap.xml`, `/feed.xml`, and a feed for each tag at `/tags/<tag>/feed.xml`. Legacy `/posts/<slug>` URLs redirect to `/blog/<slug>`.

`pnpm build` runs Astro's static build followed by `pnpm verify:seo`. The verifier checks generated pages, canonical and social metadata, structured data, OG image references, robots rules, and sitemap URLs.

## Project checks

```sh
pnpm lint
pnpm format:check
pnpm build
```

`pnpm format` applies formatting. Husky runs lint and formatting checks before each commit.
