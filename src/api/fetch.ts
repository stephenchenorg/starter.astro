import { AwesomeGraphQLClient } from 'awesome-graphql-client'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { print } from 'graphql/language/printer'

export { gql } from 'graphql-tag'

export function graphQLAPI<
  TData extends Record<string, any>,
  TVariables extends Record<string, any> = Record<string, any>,
>(
  query: TypedDocumentNode<TData, TVariables>,
  variables: TVariables = {} as TVariables,
) {
  const client = new AwesomeGraphQLClient<TypedDocumentNode>({
    endpoint: `${import.meta.env.API_BASE_URL.replace(/\/$/, '')}/graphql`,
    formatQuery: (query: TypedDocumentNode) => print(query),
  })

  const defaultVariables = {
    //
  } as Record<string, any>

  return client.request<TData, TVariables>(query, {
    ...defaultVariables,
    ...variables,
  } as TVariables)
}
