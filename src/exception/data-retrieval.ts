export class DataRetrievalException extends Error {
  constructor() {
    super("Error while retrieving data");
    this.name = "DataRetrievalException";
  }
}
