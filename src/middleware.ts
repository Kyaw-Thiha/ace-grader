import { authMiddleware } from "@clerk/nextjs/server";

// Set the paths that don't require the user to be signed in
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/published-worksheets/:id",
  "/published-worksheets/:id/answer/:answerSheetId",
  "/api(.*)",
  "/info(.*)",
  "/proxy(.*)",
];

export default authMiddleware({ publicRoutes });

// Stop Middleware running on static files and public folder
export const config = {
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - _next
  //    * - static (static files)
  //    * - favicon.ico (favicon file)
  //    * - public folder
  //    * - public folder
  //    */
  //   "/((?!static|.*\\..*|_next|favicon.ico).*)",
  // ],
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
