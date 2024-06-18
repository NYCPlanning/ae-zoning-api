import { Page } from "./Page";
import { CapitalProject } from "./CapitalProject";

export type CapitalProjectPage = Page & {
  /**
   * @type array
   */
  capitalProjects: CapitalProject[];
};
