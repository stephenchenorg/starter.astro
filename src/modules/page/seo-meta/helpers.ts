import type { PageMeta } from '../types'

export type UseSeoMetaOptions = Partial<Omit<PageMeta, 'title'>> & {
  title: string
  description?: string | null
  image?: string | null
}

export function seoMeta(options: UseSeoMetaOptions, userOptions?: PageMeta): PageMeta {
  return {
    title: userOptions?.title || options.title,
    seo_title: userOptions?.seo_title || options.seo_title || null,
    seo_description: userOptions?.seo_description || options.description || null,
    seo_keyword: userOptions?.seo_keyword || options.seo_keyword || null,
    seo_json_ld: userOptions?.seo_json_ld || options.seo_json_ld || null,
    seo_head: userOptions?.seo_head || options.seo_head,
    seo_body: userOptions?.seo_body || options.seo_body,
    og_title: userOptions?.og_title || options.og_title || options.title || null,
    og_description: userOptions?.og_description || options.og_description || options.description || null,
    og_image: userOptions?.og_image || options.og_image || options.image || null,
  } satisfies PageMeta
}
