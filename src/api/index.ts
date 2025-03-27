import { createGraphQLAPI } from '@stephenchenorg/astro/api'

export const graphQLAPI = createGraphQLAPI({
  endpoint: `${import.meta.env.API_BASE_URL.replace(/\/$/, '')}/graphql`,
})

export { gql, GraphQLValidationError } from '@stephenchenorg/astro/api'
