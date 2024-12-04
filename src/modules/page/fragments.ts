import { gql } from 'graphql-tag'

/**
 * Page fields fragment requires explicit import image
 * fields fragment `imageFields` from Image module.
 */
export const pageFields = gql`
  fragment PageFields on Page {
    title
    seo_title
    seo_keyword
    seo_json_ld
    seo_head
    seo_description
    seo_body
    og_title
    og_description
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
