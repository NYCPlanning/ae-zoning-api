export type Page = {
  /**
   * @description The limit used for the response. Defaults to 20 when the request does not specify one.
   * @type integer
   */
  limit: number;
  /**
   * @description The offset used for the response. Defaults to 0 when the request does not specify one.
   * @type integer
   */
  offset: number;
  /**
   * @description The number of rows returned in the response. If the total is less than the limit, the user is on the last page and no more results match the query.
   * @type integer
   */
  total: number;
  /**
   * @description The criteria used to sort the results. Defaults to the primary key of the table, ascending
   * @type string
   */
  order: string;
};
