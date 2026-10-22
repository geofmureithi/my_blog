import React from 'react'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import type { MDXComponents as MDXComponentsType } from 'mdx/types'
import { coreContent } from '@/lib/utils/contentlayer'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'
import type { Blog, Authors } from 'contentlayer/generated'

interface MDXLayout {
  layout: string
  content: Blog | Authors
  [key: string]: unknown
}

interface Wrapper {
  layout: string
  [key: string]: unknown
}

const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = require(`../layouts/${layout}`).default
  return <Layout content={content} {...rest} />
}

export const MDXComponents: MDXComponentsType = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: Wrapper,
  BlogNewsletterForm,
}

export const MDXLayoutRenderer = ({ layout, content, ...rest }: MDXLayout) => {
  // contentlayer compiles one component per document, so this cannot be a static component.

  const MDXLayout = useMDXComponent(content.body.code)
  const mainContent = coreContent(content)

  return (
    // eslint-disable-next-line react-hooks/static-components
    <MDXLayout layout={layout} content={mainContent} components={MDXComponents} {...rest} />
  )
}
