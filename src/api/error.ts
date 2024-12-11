interface GraphQLRequestExtensions {
  debugMessage?: string
  file?: string
  line?: number
  trace?: {
    file: string
    line: number
    call: number
  }[]
}

export class GraphQLRequestError extends Error {
  type = 'GraphQLRequestError'
  name = 'GraphQLRequestError'

  public title = 'GraphQL request error.'
  public originalMessage: string
  public query: string
  public variables: Record<string, any> | undefined
  public extensions: GraphQLRequestExtensions | undefined

  constructor(props: {
    message: string
    query: string
    variables?: Record<string, any>
    extensions?: GraphQLRequestExtensions
  }, options?: ErrorOptions) {
    const { message, query, variables, extensions } = props

    super('GraphQL request error.', options)

    const originalStack = this.stack
    this.title = 'GraphQL request error.'
    this.originalMessage = message
    this.query = query
    this.variables = variables
    this.extensions = extensions
    this.message = this.buildMessage()
    this.stack = originalStack
  }

  isNotFound(): boolean {
    return this.originalMessage.includes('Http Status 404')
  }

  private buildMessage() {
    let message = `${this.originalMessage}\n`

    if (this.extensions) {
      if (this.extensions.debugMessage) {
        message += '\n'
        message += `${this.extensions.debugMessage}\n`
      }

      if (this.extensions.file || this.extensions.line || this.extensions.trace) {
        message += '\n'
        message += '[stacktrace]\n'
        if (this.extensions.file) {
          message += `file: ${this.extensions.file}\n`
        }
        if (this.extensions.line) {
          message += `line: ${this.extensions.line}\n`
        }
        if (this.extensions.trace && Array.isArray(this.extensions.trace)) {
          message += 'trace:\n'
          for (const trace of this.extensions.trace.slice(0, 3)) {
            message += `  - file: ${trace.file}\n`
            message += `    line: ${trace.line}\n`
            message += `    call: ${trace.call}\n`
          }
        }
      }
    }

    if (this.query) {
      message += '\n'
      message += `[query]\n${this.query}\n`
    }

    if (this.variables) {
      message += '\n'
      message += `[variables]\n${JSON.stringify(this.variables, null, 2)}\n`
    }

    return message
  }

  static is(err: unknown): err is GraphQLRequestError {
    return (err as GraphQLRequestError).type === 'GraphQLRequestError'
  }
}
