import { gql } from 'graphql-tag'

export const seoMetaFields = gql`
  fragment SeoMetaFields on Page {
    seo_title
    seo_description
    seo_keyword
    seo_json_ld
    seo_head
    seo_body
    og_title
    og_description
    og_image
  }
`
