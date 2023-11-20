import OpenAI from "openai";
import { env } from "@/env.mjs";

// const configuration = new Configuration({
//   apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,
// });

const openai = new OpenAI({
  apiKey: env.NEXT_PUBLIC_OPENAI_API_KEY,

  // disable this later
  dangerouslyAllowBrowser: true,
});

export default openai;
