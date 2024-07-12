import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);

export default async function addTagsToVideo(
  filePath: string,
  tags: string[]
): Promise<void> {
  // Temporary file path
  const tempFilePath = filePath.replace(/(\.[^\.]+)$/, "-temp$1");

  // Construct the metadata flags for ffmpeg
  let metadataFlags = tags
    .map((tag, index) => `-metadata tag${index}="${tag}"`)
    .join(" ");

  // Construct the ffmpeg command to create a temporary file with updated metadata
  const ffmpegCommand = `ffmpeg -i "${filePath}" ${metadataFlags} -codec copy "${tempFilePath}"`;

  console.log(`Executing FFmpeg command: ${ffmpegCommand}`);

  try {
    const { stdout, stderr } = await execAsync(ffmpegCommand);
    if (stdout) console.log(`FFmpeg stdout: ${stdout}`);
    if (stderr) console.error(`FFmpeg stderr: ${stderr}`);

    // Replace the original file with the temporary file
    fs.renameSync(tempFilePath, filePath);
    console.log(`File replaced successfully: ${filePath}`);
  } catch (error) {
    console.error("Failed to add tags to video:", error);
    // Cleanup: remove the temporary file if it exists
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}
