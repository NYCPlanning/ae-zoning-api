export class InvalidRequestParameterException extends Error {
  constructor(message: string) {
    super(`Invalid request parameter: ${message}`);
    this.name = "InvalidRequestParameterException";
  }
}
