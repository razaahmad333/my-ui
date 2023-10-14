import { parseFragment, serializeOuter } from "parse5";
import _ from "lodash";
import fs from "fs";

export function extractSingleHtmlComponent(rawComponent) {
  const parsedComponent = parseFragment(_.trim(rawComponent));

  if (parsedComponent.childNodes.length === 0) {
    throw new Error("No component is found in html");
  }
  if (parsedComponent.childNodes.length > 1) {
    throw new Error("Only one component is allowed in html");
  }
  return parsedComponent.childNodes[0];
}

function sanitize(node) {
  delete node.sourceCodeLocation;
  delete node.parentNode;
}

export function sanitizeNodes(nodes) {
  function traverse(node) {
    sanitize(node);
    if (node.childNodes) {
      node.childNodes.forEach((child) => {
        traverse(child);
      });
    }
  }
  traverse(nodes);
  return nodes;
}

export function printDoc(doc) {
  const deepClone = _.cloneDeep(doc);
  console.log(JSON.stringify(sanitizeNodes(deepClone), null, 2));
}

export const extractImportedComponents = (htmlDoc) => {
  const importedComponentsPathMap = {};

  // Find the <import> node within the <body> of the HTML document
  const bodyNode = htmlDoc.childNodes[0].childNodes.find((node) => node.tagName === "body");
  const importNode = bodyNode.childNodes.find((node) => node.tagName === "import");

  // delete import node
  const index = bodyNode.childNodes.indexOf(importNode);
  bodyNode.childNodes.splice(index, 1);

  if (!importNode) {
    return importedComponentsPathMap;
  }

  // Extract and parse the import statements
  const importStatementNodes = importNode.childNodes;
  importStatementNodes.forEach((node) => {
    if (node.tagName === "meta") {
      importedComponentsPathMap[node.attrs[0].value] = node.attrs[1].value;
    }
  });

  return importedComponentsPathMap;
};

export const replaceImportedComponents = (htmlDoc, importedComponentsMap) => {
  const nodesToReplace = Object.keys(importedComponentsMap);

  const processNode = (node) => {
    if (node.childNodes) {
      node.childNodes.forEach((child) => {
        processNode(child);
      });
    }

    if (node.tagName && nodesToReplace.includes(node.tagName)) {
      const importedComponentPath = importedComponentsMap[node.tagName];
      const importedComponent = getComponentByPath(importedComponentPath);
      if (importedComponent) {
        const newNode = extractSingleHtmlComponent(importedComponent);
        node.tagName = newNode.tagName;
        node.attrs = newNode.attrs;
        node.childNodes = newNode.childNodes;
      } else {
        throw new Error(`Component "${node.tagName}" not found in the imported components map.`);
      }
    }
  };

  processNode(htmlDoc);
};

export const getComponentByPath = (relPath) => {
  const BASE_PATH = "app/components/";

  const componentPath = BASE_PATH + relPath;

  if (!fs.existsSync(componentPath)) {
    throw new Error(`Component "${componentPath}" not found.`);
  }

  return fs.readFileSync(componentPath, "utf8");
};
