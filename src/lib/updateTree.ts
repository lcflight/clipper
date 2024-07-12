import fs from "fs";
import path from "path"; // Import the path module

interface FileTree {
  [key: string]: FileTree | { tags: string[] };
}

export default function updateTree(
  pathString: string,
  tags: string[],
  tree: FileTree,
  filePath: string
): FileTree {
  const parts = pathString.split("/").filter((part) => part.length > 0);
  let currentPart = tree;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i === parts.length - 1) {
      currentPart[part] = { tags: tags };
    } else {
      if (!currentPart[part]) {
        currentPart[part] = {};
      }
      currentPart = currentPart[part] as FileTree;
    }
  }

  const treeJson = JSON.stringify(tree, null, 2);

  // Ensure the directory exists
  const directoryPath = path.resolve(__dirname, path.dirname(filePath));
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Write the JSON string to a file
  fs.writeFileSync(path.resolve(__dirname, filePath), treeJson);

  return tree;
}
