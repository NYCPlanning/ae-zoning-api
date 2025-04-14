import * as fs from "fs";

import { data } from "./data";
import { style } from "./style";

fs.writeFileSync("static/data.json", JSON.stringify(data));
fs.writeFileSync("static/style.json", JSON.stringify(style));
