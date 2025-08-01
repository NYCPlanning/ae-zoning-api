export class InvalidRequestParameterException extends Error {
  constructor(message: string) {
    super(`Invalid data type or format for request parameter: ${message}`);
    this.name = "InvalidRequestParameterException";
  }
}
