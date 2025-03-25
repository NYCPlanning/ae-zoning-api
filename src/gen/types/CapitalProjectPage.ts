import type { Page } from "./Page";
import type { CapitalProject } from "./CapitalProject";

export type CapitalProjectPage = Page & {
  /**
   * @type array
   */
  capitalProjects: CapitalProject[];
  /**
   * @description The total number of results matching the query parameters.
   * @type integer
   */
  totalProjects: number;
};
