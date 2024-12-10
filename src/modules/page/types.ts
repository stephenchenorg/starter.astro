export interface DataPage {
  page: Page
}

export interface Page extends PageMeta {
  fields: PageField[]
}

export interface PageMeta {
  title: string
  seo_title: string | null
  seo_description: string | null
  seo_keyword: string | null
  seo_json_ld: string | null
  seo_head?: string | null
  seo_body?: string | null
  og_title: string | null
  og_description: string | null
  og_image: string | null
}

export interface PageField {
  key: string
  type: 'text' | 'textarea' | 'html' | 'image'
  content: string | null
  image: {
    desktop: string | null
    desktop_blur: string | null
    mobile: string | null
    mobile_blur: string | null
  }
}

export interface PagePlainTextField extends PageField {
  type: 'text'
  content: string
  image: {
    desktop: null
    desktop_blur: null
    mobile: null
    mobile_blur: null
  }
}

export interface PagePlainTextareaField extends PageField {
  type: 'textarea'
  content: string
  image: {
    desktop: null
    desktop_blur: null
    mobile: null
    mobile_blur: null
  }
}

export interface PageContentField extends PageField {
  type: 'html'
  content: string
  image: {
    desktop: null
    desktop_blur: null
    mobile: null
    mobile_blur: null
  }
}

export interface PageImageField extends PageField {
  type: 'image'
  content: null
  image: {
    desktop: string
    desktop_blur: string
    mobile: string
    mobile_blur: string
  }
}
