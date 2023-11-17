import { env } from "@/env.mjs";
import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: "mt1",
  useTLS: true,
});
