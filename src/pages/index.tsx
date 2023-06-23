import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const Home: NextPage = () => {
  return (
    <>
      <div className="bg-base-200 min-h-screen">
        <div className="flex flex-col-reverse gap-8 lg:flex-row">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold">Box Office News!</h1>
            <p className="py-6 text-lg">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <div>
              <SignedOut>
                <Button asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </SignedOut>

              <SignedIn>
                <Button asChild>
                  <Link href="/my-worksheets">Go to My Worksheets</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
          <Image
            src="/images/hero.jpg"
            alt="Hero Image"
            width="800"
            height="600"
            priority
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
