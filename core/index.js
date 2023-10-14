
import * as prettier from "prettier";
import fs from "fs";
import _ from "lodash";
import { extractImportedComponents, replaceImportedComponents, printDoc } from "./helpers.js";

import { parse, parseFragment, serializeOuter } from "parse5";

// read index.html file at /app/index.html

const html = fs.readFileSync("app/index.html", "utf8");

const htmlDoc = parse(html);


// printDoc(htmlDoc);

const importedComponentsPathMap = extractImportedComponents(htmlDoc);
replaceImportedComponents(htmlDoc, importedComponentsPathMap);


const htmlDocString = serializeOuter(htmlDoc.childNodes[0]);

const beautified = await prettier.format(htmlDocString, {
    parser: "html",
    printWidth: 130,
});

// // console.log(beautified);

fs.writeFileSync("dist/index.html", beautified);

