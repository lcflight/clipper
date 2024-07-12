import * as fs from "fs";
import * as path from "path";

export default function deleteDirectory(directoryPath: string) {
  let deleteCount = 0; // Initialize delete count
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recurse for directories
        deleteCount += deleteDirectory(curPath); // Increment count based on recursion
      } else {
        // Delete file
        fs.unlinkSync(curPath);
        deleteCount++; // Increment count for files
      }
    });
    fs.rmdirSync(directoryPath); // Remove the directory itself
  }
  console.log(`Deleted ${deleteCount} items in ${directoryPath}`);
  console.log(`Directory ${directoryPath} deleted.`);
  return deleteCount; // Return the count of deleted items
}
