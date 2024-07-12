import generateTags from "./lib/aiNormalize";
import { extractFrames } from "./lib/extractFrames";
import getDescriptions from "./lib/getDescriptions";
import fs from "fs";
import deleteDirectory from "./lib/deleteDirectory";
import addTagsToVideo from "./lib/addTagsToVideo";
import { exec } from "child_process";
import updateTree from "./lib/updateTree";

const tempVideoInput = [
  "./videos/A045C805_2312071O_CANON.MXF",
  "./videos/young-teacher-reading-from-bible-in-myanmar-SBV-346523346-HD.mov",
  "./videos/drone-flies-over-dwellings-and-traditional-rorbu-houses-in-henningsvaer-village-loc-SBV-348068191-HD.mov",
];

const sampleTags = ["nature", "outdoors", "landscape", "mountain"];

async function run() {
  for (const video of tempVideoInput) {
    console.log(`\n`, "----- processing video:", video, `\n`);
    console.log("extracting frames...");
    const frames = await extractFrames(video);
    console.log("frames:", frames);

    console.log("generating descriptions...");
    const descriptions = await getDescriptions(frames.framePaths);

    console.log("cleaning up temp files...");
    deleteDirectory(frames.tempDir);
    console.log("tempdir:", frames.tempDir);
    console.log("temp files cleaned up.");

    console.log("normalizing descriptions...");
    const tags: string[] = await generateTags(descriptions).then((response) => {
      console.log(`the response: \n`, response);
      return response;
    });

    console.log("updating tree");
    let tree = {};
    updateTree(video, tags, tree, "../data/tree.json");
    console.log("tree updated:", { tree, depth: null });
    console.log(tree);

    // console.log("adding tags to video...");
    // addTagsToVideo(video, sampleTags);
  }
}

run();
