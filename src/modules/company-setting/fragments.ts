import { gql } from 'graphql-tag'

export const companySettingFields = gql`
  fragment CompanySettingFields on CompanySetting {
    lang
    name
    description
    logo
    address_1
    address_2
    email_1
    email_2
    fb_link
    ig_link
    line_link
    phone_1
    phone_2
    twitter_link
    threads_link
  }
`
