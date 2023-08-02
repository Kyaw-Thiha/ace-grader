import { useEffect, useState } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useTheme } from "next-themes";

import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ToggleTheme from "@/components/ToggleTheme";

export const metadata: Metadata = {
  title: "AceGrader",
  description: `
  AceGrader is an innovative website software designed to streamline the daily tasks of teachers and enhance student learning. 
  With our intelligent grading and feedback system, you can say goodbye to the tedious and time-consuming process of manually 
  grading worksheets.`,
  icons: {
    icon: "/icon.png",
    shortcut: "/shortcut-icon.png",
    apple: "/apple-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
};

const TopNavLayout = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Ace Grader</title>
        <meta
          name="description"
          content="AceGrader is an AI-powered innovative website software designed to streamline the daily tasks of teachers and enhance student learning. 
          With our intelligent grading and feedback system, you can say goodbye to the tedious and time-consuming process of manually 
          grading worksheets."
        />
        <meta
          property="og:title"
          content="AceGrader - Empowering Teachers & Students"
        />
        <meta
          property="og:description"
          content="AceGrader is an AI-powered innovative website software designed to streamline the daily tasks of teachers and enhance student learning."
        />
        <meta
          property="og:image"
          content="https://acegrader.com/images/logo-light.png"
        />
        <meta
          name="google-site-verification"
          content="_mt6hEbOYE3j512avV9XfozjKS4vbe7LqsukKSYmtfA"
        />
      </Head>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <nav className="container mx-auto flex justify-between px-4 py-4">
            <Button asChild className="flex gap-2 px-4 py-6" variant="outline">
              <Link href="/">
                {/* We needs white background color for dark mode as the svg image is transparent */}
                <Image
                  className="bg-white"
                  src={
                    resolvedTheme == "light"
                      ? "/images/logo-light.svg"
                      : "/images/logo-dark.svg"
                  }
                  alt="Logo"
                  width="32"
                  height="32"
                />
                <span className="text-2xl font-bold">AceGrader</span>
              </Link>
            </Button>

            <div className="flex flex-row items-center gap-4">
              <SignedIn>
                <Button className="hidden sm:block" asChild variant="outline">
                  <Link href="/worksheets">My Worksheets</Link>
                </Button>
              </SignedIn>

              <ToggleTheme />
              <SignedOut>
                <Button asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild>
                  <UserButton />
                </Button>
              </SignedIn>
            </div>
          </nav>
        </header>
        <main className="container mx-auto flex-grow px-4 py-8">
          {children}
        </main>
      </div>
    </>
  );
};

export default TopNavLayout;
