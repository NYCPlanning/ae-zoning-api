export class ResourceNotFoundException extends Error {
  constructor(message: string) {
    super(`Error locating resource: ${message}`);
    this.name = "ResourceNotFoundException";
  }
}
