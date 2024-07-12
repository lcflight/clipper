import aiNormalize from "./lib/aiNormalize";
import getDescriptions from "./lib/getDescriptions";

async function run() {
  console.log("generating descriptions...");
  const descriptions = await getDescriptions([
    "./images/andrew-pons-Os7C4iw2rDc-unsplash.jpg",
    "./images/joe-caione-qO-PIF84Vxg-unsplash.jpg",
    "./images/mark-basarab-z8ct_Q3oCqM-unsplash.jpg",
  ]);

  console.log("normalizing descriptions...");
  aiNormalize(descriptions).then((response) => {
    console.log(`the response: \n`, response.choices[0].message.content);
  });
}

run();
