export class InvalidRequestParameterException extends Error {
  constructor() {
    super("Invalid data type or format for request parameter");
    this.name = "InvalidRequestParameterException";
  }
}
