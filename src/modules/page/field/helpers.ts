import type { PageField, PagePlainTextField, PagePlainTextareaField, PageContentField, PageImageField } from '../types'

export function isPlainTextField(field: PageField): field is PagePlainTextField {
  return field.type === 'text'
}

export function isPlainTextareaField(field: PageField): field is PagePlainTextareaField {
  return field.type === 'textarea'
}

export function isContentField(field: PageField): field is PageContentField {
  return field.type === 'html'
}

export function isImageField(field: PageField): field is PageImageField {
  return field.type === 'image'
}

export function pageTextField(fields: PageField[], key: string) {
  const field = fields.find((field) => field.key === key && isPlainTextField(field))
  return field
    ? field.content
    : ''
}

export function pageImageFieldForBackground(fields: PageField[], key: string) {
  const field = fields.find((field) => field.key === key && isImageField(field))
  return field
    ? `background-image: url('${field.image.desktop}');`
    : ''
}
