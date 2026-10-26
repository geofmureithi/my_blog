import fs from 'node:fs'
import path from 'node:path'
import sizeOf from 'image-size'
import { visit } from 'unist-util-visit'

export default function remarkImageDimensions() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      if (!node.url.startsWith('/')) return

      const imagePath = path.join(process.cwd(), 'public', node.url.slice(1))
      if (!fs.existsSync(imagePath)) return

      const { width, height } = sizeOf(imagePath)
      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          width,
          height,
        },
      }
    })
  }
}
