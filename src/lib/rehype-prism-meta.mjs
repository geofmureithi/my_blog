import { visit } from 'unist-util-visit'

export default function rehypePrismMeta() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'code' || typeof node.properties?.metastring !== 'string') return
      node.data = { ...node.data, meta: node.properties.metastring }
    })
  }
}
