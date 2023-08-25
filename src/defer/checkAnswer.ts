// the `defer()` helper will be used to define a background function
import { defer } from "@defer/client";
import { checkAnswerRenamed } from "@/server/helpers/checkAnswer";

// the imported function must be wrapped with `defer()` and re-exported as default
export default defer(checkAnswerRenamed);
