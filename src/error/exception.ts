export class DataRetrievalException extends Error {
  constructor() {
    super("Error while retrieving data");
    this.name = "DataRetrievalException";
  }
}

export class InvalidRequestParameterException extends Error {
  constructor() {
    super("Invalid data type or format for request parameter");
    this.name = "InvalidRequestParameterException";
  }
}

export class ResourceNotFoundException extends Error {
  constructor() {
    super();
    this.name = "ResourceNotFoundException";
  }
}
