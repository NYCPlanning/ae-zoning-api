import * as fs from "fs";
import { parse } from "svg-parser";

import { data } from "./data";
import { style } from "./style";

fs.writeFileSync("static/data.json", JSON.stringify(data));
fs.writeFileSync("static/style.json", JSON.stringify(style));

const circleIcon = fs.readFileSync("basemap/icons/circle-11.svg");
const starIcon = fs.readFileSync("basemap/icons/star-11.svg");

const spriteJson = {
  "circle-11": parse(circleIcon.toString()),
  "star-11": parse(starIcon.toString()),
};

fs.writeFileSync("static/sprite.json", JSON.stringify(spriteJson));
