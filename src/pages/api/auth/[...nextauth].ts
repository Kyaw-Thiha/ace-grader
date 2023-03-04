import NextAuth from "next-auth";
import { authOptions } from "~/utils/server/auth";

export default NextAuth(authOptions);
