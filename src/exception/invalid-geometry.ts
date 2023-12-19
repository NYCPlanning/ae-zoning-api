export class InvalidGeometryException extends Error {
  constructor() {
    super("Invalid geometry");
    this.name = "InvalidGeometryException";
  }
}
