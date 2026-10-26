export function tagSlug(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, '-')
}

export function uniqueTags(tags: string[]) {
  const bySlug = new Map<string, string>()
  for (const tag of tags) {
    const slug = tagSlug(tag)
    if (slug && !bySlug.has(slug)) bySlug.set(slug, tag.trim())
  }
  return [...bySlug].map(([slug, tag]) => ({ slug, tag }))
}
