export class DuplicateRecordException extends Error {
  constructor() {
    super('User already exists.');
  }
}
