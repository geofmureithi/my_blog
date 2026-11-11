import { bindOnce } from './bind-once'

export const articleSearchInputId = 'article-search'
export const articleSearchEmptyId = 'article-search-empty'

export function articleSearchText(post: { title: string; summary?: string; tags: string[] }) {
  return `${post.title} ${post.summary ?? ''} ${post.tags.join(' ')}`.toLowerCase()
}

export function filterArticles(input: HTMLInputElement) {
  const query = input.value.trim().toLowerCase()
  const items = document.querySelectorAll<HTMLElement>('[data-article]')
  let visible = 0

  for (const item of items) {
    const matches = !query || (item.dataset.search ?? '').includes(query)
    item.hidden = !matches
    if (matches) visible += 1
  }

  const empty = document.getElementById(articleSearchEmptyId)
  if (empty) empty.hidden = visible > 0
}

export function bindArticleSearch() {
  const searchInput = document.getElementById(articleSearchInputId)
  if (!(searchInput instanceof HTMLInputElement)) return

  bindOnce(searchInput, (input) => {
    const onSearch = () => filterArticles(input)
    input.addEventListener('input', onSearch)
    input.addEventListener('search', onSearch)
    if (input.value) onSearch()
  })
}
