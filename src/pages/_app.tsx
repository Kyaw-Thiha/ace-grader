import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Toast from "@/components/Toast";
import TopNavLayout from "@/components/TopNavLayout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <TopNavLayout>
        <Component {...pageProps} />
        <Toast />
      </TopNavLayout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
