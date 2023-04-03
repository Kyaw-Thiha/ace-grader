import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "@utils/api";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Toast from "@components/Toast";
import { toast } from "react-toastify";

const AnswerSheet: NextPage = () => {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Worksheesh</title>
        <meta name="description" content="Worksheeet Editor" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main>
        <div className="navbar">
          <Link href="/" className="btn-ghost btn text-2xl normal-case">
            <Image
              src="/images/logo-icon.png"
              alt="Logo"
              width="32"
              height="32"
            />
            <h2 className="ml-2">Worksheesh</h2>
          </Link>
        </div>
        {isReady ? <></> : <></>}
        <Toast />
      </main>
    </>
  );
};

export default AnswerSheet;
