export type Error = {
  /**
   * @type number
   */
  statusCode: number;
  /**
   * @type string
   */
  message: string;
  /**
   * @type string | undefined
   */
  error?: string;
};
