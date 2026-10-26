import { readdir, writeFile } from 'node:fs/promises'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline'
import { join } from 'node:path'
import { stringify } from 'yaml'

const contentDir = join(process.cwd(), 'src/content')
const authorDir = join(contentDir, 'authors')
const blogDir = join(contentDir, 'blog')
const authorIds = (await readdir(authorDir))
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => file.replace(/\.mdx$/, ''))
const readline = createInterface({ input: stdin, output: stdout })
const input = readline[Symbol.asyncIterator]()

async function ask(prompt) {
  stdout.write(prompt)
  const line = await input.next()
  if (line.done) throw new Error('Input ended before all questions were answered.')
  return line.value.trim()
}

try {
  const title = await ask('Post title: ')
  if (!title) throw new Error('A title is required.')

  const summary = await ask('Summary (optional): ')
  const tags = (await ask('Tags, comma-separated (optional): '))
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
  const authorsInput = await ask(
    `Author IDs, comma-separated (${authorIds.join(', ')}; blank uses default): `
  )
  const authors = authorsInput
    ? authorsInput
        .split(',')
        .map((author) => author.trim())
        .filter(Boolean)
    : ['default']
  const unknownAuthors = authors.filter((author) => !authorIds.includes(author))
  if (unknownAuthors.length) throw new Error(`Unknown author IDs: ${unknownAuthors.join(', ')}`)

  const draftInput = (await ask('Save as draft? [Y/n]: ')).toLowerCase()
  if (draftInput && !['y', 'yes', 'n', 'no'].includes(draftInput)) {
    throw new Error('Choose yes or no for the draft status.')
  }

  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'untitled'
  const filePath = join(blogDir, `${slug}.mdx`)
  const today = new Date()
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
  const frontmatter = stringify({
    title,
    date,
    tags,
    draft: !['n', 'no'].includes(draftInput),
    ...(summary && { summary }),
    images: [],
    authors,
  })

  await writeFile(filePath, `---\n${frontmatter}---\n\n`, { flag: 'wx' })
  console.log(`Created ${filePath}`)
} finally {
  readline.close()
}
