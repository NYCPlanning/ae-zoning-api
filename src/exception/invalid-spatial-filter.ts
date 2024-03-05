export class InvalidSpatialFilterRequestParametersException extends Error {
  constructor(message: string) {
    super(`Invalid request parameters for spatial filter: ${message}`);
    this.name = "InvalidSpatialFilterRequestParametersException";
  }
}
