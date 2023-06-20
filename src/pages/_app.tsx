import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "@utils/api";

import { ChakraProvider } from "@chakra-ui/react";

import "src/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ClerkProvider>
        <Component {...pageProps} />
      </ClerkProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
