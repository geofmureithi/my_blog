import React, { ComponentType } from 'react'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import { coreContent } from '@/lib/utils/contentlayer'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'
import type { Blog, Authors } from 'contentlayer/generated'

import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import AuthorLayout from '@/layouts/AuthorLayout'
import ListLayout from '@/layouts/ListLayout'

interface MDXLayout {
  layout: string
  content: Blog | Authors
  [key: string]: unknown
}

const layouts: Record<string, any> = {
  PostLayout,
  PostSimple,
  AuthorLayout,
  ListLayout,
}

const Wrapper = ({ layout, content, ...rest }: MDXLayout) => {
  const Layout = layouts[layout] || layouts.PostLayout
  return <Layout content={content} {...rest} />
}

type ComponentMap = Record<string, ComponentType<any>>

export const MDXComponents: ComponentMap = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: Wrapper,
  BlogNewsletterForm,
}

export const MDXLayoutRenderer = ({ layout, content, ...rest }: MDXLayout) => {
  const MDXLayout = useMDXComponent(content.body.code)
  const mainContent = coreContent(content)

  return <MDXLayout layout={layout} content={mainContent} components={MDXComponents} {...rest} />
}
