import { access, readFile, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { parse as parseYaml } from 'yaml'

const metadataSource = await readFile(join(process.cwd(), 'src/data/site-metadata.ts'), 'utf8')
const siteUrl = metadataSource.match(/siteUrl:\s*'([^']+)'/)?.[1]
if (!siteUrl) throw new Error('Could not read siteUrl from src/data/site-metadata.ts')
const ogImageBaseUrl = process.env.OG_IMAGE_BASE_URL || siteUrl
const siteOrigin = new URL(siteUrl).origin
const ogImageOrigin = new URL(ogImageBaseUrl).origin
const dist = join(process.cwd(), 'dist')
const errors = []

function assert(condition, message) {
  if (!condition) errors.push(message)
}

function decodeEntities(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, code) => {
    if (code[0] === '#') {
      const number =
        code[1].toLowerCase() === 'x'
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10)
      return String.fromCodePoint(number)
    }
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[code.toLowerCase()]
  })
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1].toLowerCase(),
      decodeEntities(match[2]),
    ])
  )
}

function tags(html, name) {
  return html.matchAll(new RegExp(`<${name}\\b(?:[^"'<>]|"[^"]*"|'[^']*')*>`, 'gi'))
}

function metaContents(html, attribute, value) {
  return [...tags(html, 'meta')]
    .map((match) => attributes(match[0]))
    .filter((attrs) => attrs[attribute] === value)
    .map((attrs) => attrs.content || '')
}

function metaContent(html, attribute, value) {
  return metaContents(html, attribute, value)[0]
}

function openGraphImages(html) {
  const images = []
  for (const match of tags(html, 'meta')) {
    const attrs = attributes(match[0])
    if (attrs.property === 'og:image') images.push({ url: attrs.content || '' })
    else if (attrs.property?.startsWith('og:image:') && images.length) {
      images[images.length - 1][attrs.property.slice('og:image:'.length)] = attrs.content || ''
    }
  }
  return images
}

function canonicalUrl(html) {
  for (const match of tags(html, 'link')) {
    const attrs = attributes(match[0])
    if (attrs.rel?.split(/\s+/).includes('canonical')) return attrs.href
  }
}

function decodeXml(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (entity, code) => {
    if (code[0] === '#') {
      const number =
        code[1].toLowerCase() === 'x'
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10)
      return String.fromCodePoint(number)
    }
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[code.toLowerCase()]
  })
}

function readFrontmatter(source, label) {
  const text = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1]
  if (!text) {
    errors.push(`${label}: YAML frontmatter is required`)
    return {}
  }
  try {
    return parseYaml(text) || {}
  } catch (error) {
    errors.push(`${label}: frontmatter must parse (${error.message})`)
    return {}
  }
}

function parseJsonLd(html, label) {
  const data = []
  for (const match of html.matchAll(
    /<script\b(?=[^>]*\btype="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      data.push(JSON.parse(match[1]))
    } catch {
      errors.push(`${label}: JSON-LD must parse`)
    }
  }
  return data
}

function imageUrl(image) {
  return new URL(image, ogImageBaseUrl).href
}

function expectedImageType(url) {
  const pathname = new URL(url).pathname.toLowerCase()
  if (pathname.endsWith('.svg')) return 'image/svg+xml'
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg'
}

function expectedPersonId(authorId) {
  return `${siteUrl}/about#person${authorId === 'default' ? '' : `-${encodeURIComponent(authorId)}`}`
}

async function htmlFiles(path = dist) {
  const entries = await readdir(path, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(path, entry.name)
      if (entry.isDirectory()) return htmlFiles(fullPath)
      return entry.name.endsWith('.html') ? [fullPath] : []
    })
  )
  return nested.flat()
}

const robots = await readFile(join(dist, 'robots.txt'), 'utf8').catch(() => '')
assert(/^User-agent:\s*\*\s*$/im.test(robots), 'robots.txt must include a wildcard user-agent')
assert(/^Allow:\s*\/\s*$/im.test(robots), 'robots.txt must allow crawling')
assert(!/^Disallow:\s*\/\s*$/im.test(robots), 'robots.txt must not block the whole site')
const sitemapDirectives = robots.match(/^Sitemap:\s*(\S+)\s*$/gim) || []
assert(
  sitemapDirectives.length === 1 &&
    sitemapDirectives[0].split(':').slice(1).join(':').trim() === `${siteUrl}/sitemap.xml`,
  'robots.txt must point once to the canonical sitemap'
)

const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8').catch(() => '')
assert(
  sitemap.includes('<urlset') && sitemap.includes('</urlset>'),
  'sitemap.xml must contain a URL set'
)
const sitemapRecords = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => {
  const loc = match[1].match(/<loc>([\s\S]*?)<\/loc>/)?.[1]
  const lastmod = match[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]
  return { loc: loc && decodeXml(loc), lastmod: lastmod && decodeXml(lastmod) }
})
const sitemapUrls = sitemapRecords.map(({ loc }) => loc).filter(Boolean)
assert(sitemapUrls.length > 0, 'sitemap.xml must contain URLs')
assert(
  new Set(sitemapUrls).size === sitemapUrls.length,
  'sitemap.xml must not contain duplicate URLs'
)
for (const loc of sitemapUrls) {
  try {
    assert(
      new URL(loc).origin === siteOrigin,
      `sitemap.xml must not list a URL outside ${siteOrigin}: ${loc}`
    )
  } catch {
    assert(false, `sitemap.xml contains an invalid URL: ${loc}`)
  }
}

const pages = await htmlFiles()
assert(pages.length > 0, 'build must output HTML pages')
const articlesByLabel = new Map()
const expectedIndexableCanonicals = new Set()
const canonicalOwners = new Map()
const titles = new Set()
let aboutPerson

for (const path of pages) {
  const html = await readFile(path, 'utf8')
  const label = relative(dist, path).split(sep).join('/')
  const title = decodeEntities(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '')
  const description = metaContent(html, 'name', 'description')
  const twitterCard = metaContent(html, 'name', 'twitter:card')
  const twitterTitle = metaContent(html, 'name', 'twitter:title')
  const twitterDescription = metaContent(html, 'name', 'twitter:description')
  const canonical = canonicalUrl(html)
  const ogUrl = metaContent(html, 'property', 'og:url')
  const ogTitle = metaContent(html, 'property', 'og:title')
  const ogDescription = metaContent(html, 'property', 'og:description')
  const ogImageGroups = openGraphImages(html)
  const ogImages = ogImageGroups.map((image) => image.url)
  const twitterImages = metaContents(html, 'name', 'twitter:image')
  const twitterAlt = metaContent(html, 'name', 'twitter:image:alt')
  const jsonLd = parseJsonLd(html, label)
  const robotsMeta = metaContent(html, 'name', 'robots') || ''

  assert(Boolean(title), `${label}: title is required`)
  assert(Boolean(description), `${label}: meta description is required`)
  assert(Boolean(canonical), `${label}: canonical URL is required`)
  assert(ogUrl === canonical, `${label}: og:url must match canonical URL`)
  assert(ogTitle === title, `${label}: og:title must match the page title`)
  assert(ogDescription === description, `${label}: og:description must match the page description`)
  assert(
    twitterCard === 'summary_large_image',
    `${label}: twitter:card must be summary_large_image`
  )
  assert(twitterTitle === title, `${label}: twitter:title must match the page title`)
  assert(
    twitterDescription === description,
    `${label}: twitter:description must match the page description`
  )
  assert(Boolean(metaContent(html, 'property', 'og:locale')), `${label}: og:locale is required`)
  assert(
    Boolean(metaContent(html, 'name', 'twitter:site')?.startsWith('@')),
    `${label}: twitter:site must be a handle`
  )
  assert(
    Boolean(metaContent(html, 'name', 'twitter:creator')?.startsWith('@')),
    `${label}: twitter:creator must be a handle`
  )
  assert(
    metaContent(html, 'name', 'twitter:url') === canonical,
    `${label}: twitter:url must match canonical URL`
  )
  assert(
    ogImages.length > 0 && ogImages.every((image) => /^https?:\/\//i.test(image)),
    `${label}: og:image must use absolute HTTP(S) URLs`
  )
  assert(
    twitterImages[0] === ogImages[0] && twitterImages.length === 1,
    `${label}: Twitter must use the first Open Graph image`
  )
  assert(
    ogImageGroups.length === ogImages.length && ogImageGroups.every((image) => Boolean(image.alt)),
    `${label}: every og:image must have alt text`
  )
  assert(Boolean(twitterAlt), `${label}: twitter:image:alt is required`)
  if (label === '404.html') {
    assert(/\bnoindex\b/i.test(robotsMeta), '404.html: page must not be indexed')
    assert(/\bfollow\b/i.test(robotsMeta), '404.html: page must allow link following')
  } else {
    assert(
      /\bindex\b/i.test(robotsMeta) && /\bfollow\b/i.test(robotsMeta),
      `${label}: page must be indexable and allow link following`
    )
  }
  assert(
    /max-image-preview:\s*large/i.test(robotsMeta),
    `${label}: robots meta must allow large image previews`
  )
  if (title) {
    assert(!titles.has(title), `duplicate page title: ${title}`)
    titles.add(title)
  }

  if (canonical) {
    try {
      const parsedCanonical = new URL(canonical)
      if (parsedCanonical.origin === siteOrigin && !/\bnoindex\b/i.test(robotsMeta)) {
        assert(
          !canonicalOwners.has(canonical),
          `duplicate canonical URL ${canonical} in ${canonicalOwners.get(canonical)} and ${label}`
        )
        canonicalOwners.set(canonical, label)
        expectedIndexableCanonicals.add(canonical)
      }
    } catch {
      assert(false, `${label}: canonical URL must be absolute and valid`)
    }
  }

  for (const imageGroup of ogImageGroups) {
    try {
      const image = new URL(imageGroup.url)
      if (image.origin !== siteOrigin && image.origin !== ogImageOrigin) continue
      const imagePath = join(dist, decodeURIComponent(image.pathname).replace(/^\/+/, ''))
      await access(imagePath).catch(() =>
        errors.push(`${label}: OG image does not exist at ${imagePath}`)
      )
      assert(Boolean(imageGroup.width), `${label}: local OG image needs a width`)
      assert(Boolean(imageGroup.height), `${label}: local OG image needs a height`)
      assert(Boolean(imageGroup.type), `${label}: local OG image needs a MIME type`)
      const expectedType = expectedImageType(imageGroup.url)
      if (expectedType)
        assert(
          imageGroup.type === expectedType,
          `${label}: local OG image must use ${expectedType}`
        )
    } catch {
      assert(false, `${label}: invalid OG image URL ${imageGroup.url}`)
    }
  }

  for (const data of jsonLd) {
    if (data['@type'] === 'Article')
      articlesByLabel.set(label, { data, html, canonical, description, title, ogImages })
    if (data['@type'] === 'Person' && label === 'about.html') aboutPerson = data
  }
}

assert(Boolean(aboutPerson), 'about page must publish Person JSON-LD')
assert(
  aboutPerson?.['@id'] === expectedPersonId('default'),
  'About Person must use the stable site identity'
)
assert(Boolean(aboutPerson?.alternateName), 'Person JSON-LD must include the known alternate name')
assert(Boolean(aboutPerson?.sameAs?.length), 'Person JSON-LD must link verified social profiles')
assert(Boolean(articlesByLabel.size), 'blog posts must publish Article JSON-LD')

const contentDir = join(process.cwd(), 'src/content/blog')
const authorDir = join(process.cwd(), 'src/content/authors')
const authorFiles = (await readdir(authorDir)).filter((file) => file.endsWith('.mdx'))
const authorsById = new Map()
for (const file of authorFiles) {
  const id = file.replace(/\.mdx$/, '')
  authorsById.set(
    id,
    readFrontmatter(await readFile(join(authorDir, file), 'utf8'), `authors/${file}`)
  )
}
const defaultAuthor = authorsById.get('default') || {}
const expectedSocials = [
  defaultAuthor.github,
  defaultAuthor.linkedin,
  defaultAuthor.twitter,
].filter(Boolean)
assert(
  expectedSocials.every((profile) => aboutPerson?.sameAs?.includes(profile)),
  'About Person must include every verified author profile'
)
assert(
  aboutPerson?.alternateName === defaultAuthor.alternateName,
  'About Person alternateName must match author content'
)

const postFiles = (await readdir(contentDir)).filter((file) => file.endsWith('.mdx'))
let generatedCards = 0
let expectedArticleCount = 0
for (const file of postFiles) {
  const slug = file.replace(/\.mdx$/, '')
  const frontmatter = readFrontmatter(
    await readFile(join(contentDir, file), 'utf8'),
    `blog/${file}`
  )
  if (frontmatter.draft) continue
  expectedArticleCount += 1
  const label = `blog/${slug}.html`
  const article = articlesByLabel.get(label)
  assert(Boolean(article), `${slug}: published post must have Article JSON-LD`)
  if (!article) continue

  const canonical = frontmatter.canonicalUrl || `${siteUrl}/blog/${slug}`
  assert(article.canonical === canonical, `${slug}: canonical URL must match the post frontmatter`)
  const expectedImages =
    Array.isArray(frontmatter.images) && frontmatter.images.length
      ? frontmatter.images.map(imageUrl)
      : [`${ogImageBaseUrl}/og/${slug}.png`]
  assert(
    JSON.stringify(article.ogImages) === JSON.stringify(expectedImages),
    `${slug}: preserve all authored OG images or use its generated card`
  )
  assert(
    JSON.stringify(article.data.image?.map((image) => image.url)) ===
      JSON.stringify(expectedImages),
    `${slug}: Article JSON-LD image URLs must match OG images`
  )
  for (const image of article.data.image || []) {
    const expectedType = expectedImageType(image.url)
    if (expectedType)
      assert(image.type === expectedType, `${slug}: Article JSON-LD image must use ${expectedType}`)
  }
  assert(
    article.data.headline === frontmatter.title,
    `${slug}: Article headline must match the source title`
  )
  assert(
    article.data.mainEntityOfPage?.['@id'] === canonical,
    `${slug}: Article mainEntityOfPage must match canonical URL`
  )
  const expectedPublished = new Date(frontmatter.date).toISOString()
  assert(Boolean(article.data.datePublished), `${slug}: Article datePublished is required`)
  assert(
    article.data.datePublished === expectedPublished,
    `${slug}: Article datePublished must match the source date`
  )
  assert(
    metaContent(article.html, 'property', 'article:published_time') === expectedPublished,
    `${slug}: article:published_time must match the source date`
  )
  const expectedModified = frontmatter.lastmod
    ? new Date(frontmatter.lastmod).toISOString()
    : undefined
  const modifiedMeta = metaContent(article.html, 'property', 'article:modified_time')
  assert(
    article.data.dateModified === expectedModified,
    `${slug}: dateModified must match explicit lastmod only`
  )
  assert(
    modifiedMeta === expectedModified,
    `${slug}: article:modified_time must match explicit lastmod only`
  )
  assert(
    JSON.stringify(article.data.description) === JSON.stringify(article.description),
    `${slug}: Article description must match page metadata`
  )

  const authorIds =
    Array.isArray(frontmatter.authors) && frontmatter.authors.length
      ? frontmatter.authors
      : ['default']
  const actualAuthors = Array.isArray(article.data.author)
    ? article.data.author
    : [article.data.author]
  assert(actualAuthors.length === authorIds.length, `${slug}: preserve every authored Person`)
  for (let index = 0; index < authorIds.length; index += 1) {
    const authorId = authorIds[index]
    assert(authorsById.has(authorId), `${slug}: unknown author ${authorId}`)
    assert(
      actualAuthors[index]?.['@type'] === 'Person',
      `${slug}: each Article author must be a Person`
    )
    assert(
      actualAuthors[index]?.['@id'] === expectedPersonId(authorId),
      `${slug}: author ${authorId} must use its stable Person identity`
    )
    const authorContent = authorsById.get(authorId) || {}
    const expectedAuthorProfiles = [
      authorContent.github,
      authorContent.linkedin,
      authorContent.twitter,
    ].filter(Boolean)
    assert(
      JSON.stringify(actualAuthors[index]?.sameAs || []) === JSON.stringify(expectedAuthorProfiles),
      `${slug}: author ${authorId} profiles must match author content`
    )
  }

  if (expectedImages[0] === `${ogImageBaseUrl}/og/${slug}.png`) {
    generatedCards += 1
    const imagePath = join(dist, 'og', `${slug}.png`)
    const bytes = await readFile(imagePath).catch(() => Buffer.alloc(0))
    assert(
      bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      `${slug}: generated OG card must be a PNG`
    )
    if (bytes.length >= 24) {
      assert(
        bytes.readUInt32BE(16) === 1200 && bytes.readUInt32BE(20) === 600,
        `${slug}: generated OG card must remain 1200x600`
      )
    }
  }
}

assert(
  articlesByLabel.size === expectedArticleCount,
  'every published post must produce exactly one Article JSON-LD page'
)
assert(
  new Set(sitemapUrls).size === expectedIndexableCanonicals.size,
  'sitemap URL count must match indexable canonical count'
)
assert(
  sitemapUrls.every((url) => expectedIndexableCanonicals.has(url)),
  'sitemap must not contain stale or non-canonical URLs'
)
assert(
  [...expectedIndexableCanonicals].every((url) => sitemapUrls.includes(url)),
  'sitemap must include every indexable same-site canonical'
)

for (const { loc, lastmod } of sitemapRecords) {
  if (!lastmod) continue
  assert(!Number.isNaN(Date.parse(lastmod)), `sitemap has an invalid lastmod for ${loc}`)
}

if (errors.length) {
  console.error(
    `SEO verification failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`
  )
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log(
    `SEO verification passed: ${pages.length} pages, ${expectedArticleCount} articles, ${generatedCards} generated OG cards, ${sitemapUrls.length} sitemap URLs, robots rules, canonical metadata, OG/Twitter images, and Person/Article JSON-LD.`
  )
}
