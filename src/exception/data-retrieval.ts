export class DataRetrievalException extends Error {
  constructor(message: string) {
    super(`Error while retrieving data: ${message}`);
    this.name = "DataRetrievalException";
  }
}
