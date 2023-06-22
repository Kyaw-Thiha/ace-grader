import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "SmartGrader",
  description: "This is SmartGrader.",
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
  return (
    <>
      <Head>
        <title>Smart Grader</title>
        <meta
          name="description"
          content="A website where teachers can automate their workflow"
        />
      </Head>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <nav className="container mx-auto flex justify-between px-4 py-4">
            <Link href="/" className="btn-ghost btn text-2xl normal-case">
              <Image
                src="/images/logo-icon.png"
                alt="Logo"
                width="32"
                height="32"
              />
              <span className="text-2xl font-bold">SmartGrader</span>{" "}
            </Link>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
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

// const TopNavLayout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="navbar backdrop-blur-lg">
//         <div className="flex-1">
//           <Link href="/" className="btn-ghost btn text-2xl normal-case">
//             <Image
//               src="/images/logo-icon.png"
//               alt="Logo"
//               width="32"
//               height="32"
//             />
//             <h2 className="ml-2">SmartGrader</h2>
//           </Link>
//         </div>
//         <div className="flex-none">
//           <NavActions />
//         </div>
//       </header>
//       <main className="container mx-auto flex-grow px-4 py-8">{children}</main>
//     </div>
//   );
// };

// export default TopNavLayout;

// const NavActions: React.FC = () => {
//   return (
//     <>
//       <SignedOut>
//         <SignInButton />
//       </SignedOut>
//       <SignedIn>
//         <UserButton />
//       </SignedIn>
//     </>
//   );
// };
