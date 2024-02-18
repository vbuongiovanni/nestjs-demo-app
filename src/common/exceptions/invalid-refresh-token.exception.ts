export class InvalidatedRefreshTokenException extends Error {
  constructor() {
    super('The refresh token had already been used. This may be a sign that your token has been compromised. Please login again.');
  }
}
