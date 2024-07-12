import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import os from "os";
import path from "path";

export async function extractFrames(
  videoPath: string
): Promise<{ tempDir: string; framePaths: string[] }> {
  if (!ffmpeg) {
    throw new Error("ffmpeg is not installed or not found.");
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "frames-"));

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error("Error getting video metadata:", err);
        reject(err);
        return;
      }

      const duration = metadata.format.duration;
      const frameIntervals = 5; // seconds
      const frameCount = Math.floor(duration / frameIntervals);
      const timeMarks = Array.from({ length: frameCount }, (_, i) =>
        (i * frameIntervals).toString()
      );

      const framePaths: string[] = [];
      ffmpeg(videoPath)
        .on("end", () => {
          console.log(`Frames extracted to ${tempDir}`);
          resolve({ tempDir, framePaths }); // Modify here to return an object
        })
        .on("error", (err) => {
          console.error("Error extracting frames:", err);
          reject(err);
        })
        .on("filenames", (filenames) => {
          filenames.forEach((filename) => {
            framePaths.push(path.join(tempDir, filename));
          });
        })
        .screenshots({
          timemarks: timeMarks, // Use the generated array of time marks
          folder: tempDir,
          filename: "frame-at-%s-seconds.png",
        });
    });
  });
}
