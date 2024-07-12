import OpenAI from "openai";
import process from "process";

const openai = new OpenAI({ apiKey: process.env.OPENAI_CLIPPER_API_KEY });

export default async function aiNormalize(promptArray) {
  console.log("promptArray:", promptArray);
  const prompt = promptArray.join("\n");
  const completion = await caller(prompt);
  return completion;
}

async function caller(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Your role is to take input and distil it into a clean comma separated list of relevent tags. you will imaging the scene and add tads that match the scene. You will return more tags rather than less.",
      },
      { role: "user", content: prompt },
    ],
  });

  return completion;
}
