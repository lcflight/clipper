import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export default async function getDescriptions(imageDirs: string[]) {
  try {
    // Wrap each directory path in quotes to handle spaces
    const dirs = imageDirs.map((dir) => `"${dir}"`).join(",");
    const { stdout, stderr } = await execPromise(
      `python ./scripts/run_blip.py ${dirs}`
    );

    if (stderr) {
      console.error("Error:", stderr);
      return;
    }

    console.log("descriptions (from the TS):", stdout);
    return stdout.split(",");
  } catch (error) {
    console.error("Execution error:", error);
  }
}
