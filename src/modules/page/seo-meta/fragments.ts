import { gql } from 'graphql-tag'

export const seoMetaFields = (dummyClass: string) => gql(`
  fragment DummyClassSeoMetaFields on DummyClass {
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
`.replace(/DummyClass/g, dummyClass))
