export class ResourceNotFoundException extends Error {
  constructor() {
    super();
    this.name = "ResourceNotFoundException";
  }
}
