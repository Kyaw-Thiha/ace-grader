import { env } from "@/env.mjs";
import PusherClient from "pusher-js";

/**
 * The following pusher client uses auth, not neccessary for the video chatroom example
 * Only the cluster would be important for that
 * These values can be found after creating a pusher app under
 * @see https://dashboard.pusher.com/apps/<YOUR_APP_ID>/keys
 */

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: "mt1",
  // authEndpoint: '/api/pusher-auth',
  // authTransport: 'ajax',
  // auth: {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // },
});
