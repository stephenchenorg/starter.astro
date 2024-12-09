import { gql } from 'graphql-tag'

/**
 * Page fields fragment requires explicit import image
 * fields fragment `imageFields` from Image module.
 */
export const pageFields = gql`
  fragment PageFields on Page {
    title
    seo_title
    seo_description
    seo_keyword
    seo_json_ld
    seo_head
    seo_body
    og_title
    og_description
    og_image
    fields {
      key
      content
      type
      image {
        ...ImageFields
      }
    }
  }
`
