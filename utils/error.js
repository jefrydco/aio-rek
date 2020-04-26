export class HTTPError extends Error {
  constructor(response) {
    // Set the message to the status text, such as Unauthorized,
    // with some fallbacks. This message should never be undefined.
    super(
      response.statusText ||
        String(
          response.status === 0 || response.status
            ? response.status
            : 'Unknown response error'
        )
    )
    this.name = 'HTTPError'
    this.response = response
  }
}
