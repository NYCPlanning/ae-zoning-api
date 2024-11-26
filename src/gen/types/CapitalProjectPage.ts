import type { Page } from "./Page";
import type { CapitalProject } from "./CapitalProject";

export type CapitalProjectPage = Page & {
  /**
   * @type array
   */
  capitalProjects: CapitalProject[];
};
