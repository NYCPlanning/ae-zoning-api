export class TilesetRetrievalException extends Error {
  constructor() {
    super("Error retrieving tileset");
    this.name = "TilesetRetrievalException";
  }
}
