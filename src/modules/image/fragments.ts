import { gql } from 'graphql-tag'

export const imageFields = gql`
  fragment ImageFields on Image {
    desktop
    desktop_blur
    mobile
    mobile_blur
  }
`

export const coverFields = gql`
  fragment CoverFields on Cover {
    desktop
    desktop_blur
    mobile
    mobile_blur
  }
`

export const backgroundFields = gql`
  fragment BackgroundFields on Background {
    desktop
    desktop_blur
    mobile
    mobile_blur
  }
`
