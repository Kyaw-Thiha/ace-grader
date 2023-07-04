import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import TopNavLayout from "@/components/TopNavLayout";

const Home: NextPage = () => {
  return (
    <TopNavLayout>
      <HeroSection />
      <FeatureSection />
    </TopNavLayout>
  );
};

const HeroSection = () => {
  return (
    <div className="pb-6 sm:pb-8 lg:pb-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <section className="flex flex-col-reverse justify-between gap-6 sm:gap-10 md:gap-16 lg:flex-row">
          <div className="flex flex-col justify-center sm:text-center lg:py-12 lg:text-left xl:w-5/12 xl:py-24">
            <p className="mb-4 font-semibold text-muted-foreground md:mb-6 md:text-lg xl:text-xl">
              {/* Very proud to introduce */}
              Welcome to AceGrader
            </p>

            <h1 className="text-black-800 mb-8 text-4xl font-bold sm:text-5xl md:mb-12 md:text-6xl">
              Revolutionising teachers&#39; workflow
            </h1>

            <p className="mb-8 leading-relaxed text-gray-500 md:mb-12 lg:w-4/5 xl:text-lg">
              {/* Automate Your Grading Process and Empower Your Students */}
              Empower your students with an AI-powered automated grading
              process, streamlining efficiency and enhancing their learning
              experience.
            </p>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center lg:justify-start">
              <SignedOut>
                <Button asChild className="px-8 py-3">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </SignedOut>

              <SignedIn>
                <Button asChild className="px-8 py-3">
                  <Link href="/worksheets">Go to My Worksheets</Link>
                </Button>
              </SignedIn>
              {/* <a
                  href="#"
                  className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base"
                >
                  Start now
                </a>

                <a
                  href="#"
                  className="inline-block rounded-lg bg-gray-200 px-8 py-3 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-300 focus-visible:ring active:text-gray-700 md:text-base"
                >
                  Take tour
                </a> */}
            </div>
          </div>

          <div className="h-48 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:h-auto xl:w-5/12">
            <Image
              src="/images/hero.jpg"
              width="1000"
              height="500"
              alt="Hero Image"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureSection = () => {
  return (
    <section className=" text-gray-600">
      <div className="container mx-auto px-5 py-24">
        <h1 className="mb-20 text-center text-2xl font-medium text-gray-900 sm:text-3xl">
          Features
        </h1>
        <div className="-mx-4 -mb-10 -mt-4 flex flex-wrap space-y-6 sm:-m-4 md:space-y-0">
          <div className="flex p-4 md:w-1/3">
            <div className="mb-4 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-6 w-6"
                viewBox="0 0 24 24"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div className="flex-grow pl-6">
              <h2 className="title-font mb-2 text-lg font-medium text-gray-900">
                Effortless Worksheet Sharing
              </h2>
              <p className="text-base leading-relaxed">
                Creating a worksheet is as easy as a few clicks. Once you&#39;ve
                crafted your custom worksheet, effortlessly share it with your
                students using our shareable link feature. Gone are the days of
                printing stacks of papers or dealing with lost assignments.
                AceGrader makes sharing and distributing worksheets a breeze.
              </p>
              {/* <a className="mt-3 inline-flex items-center text-indigo-500">
                Learn More
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </a> */}
            </div>
          </div>
          <div className="flex p-4 md:w-1/3">
            <div className="mb-4 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-6 w-6"
                viewBox="0 0 24 24"
              >
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
              </svg>
            </div>
            <div className="flex-grow pl-6">
              <h2 className="title-font mb-2 text-lg font-medium text-gray-900">
                Seamless Student Engagement
              </h2>
              <p className="text-base leading-relaxed">
                Students can access their assigned worksheets from any device
                with an internet connection. Our user-friendly interface allows
                them to answer questions directly on the platform, making the
                learning process more interactive and engaging. Say goodbye to
                traditional pen and paper, and embrace the digital age of
                education.
              </p>
            </div>
          </div>
          <div className="flex p-4 md:w-1/3">
            <div className="mb-4 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-6 w-6"
                viewBox="0 0 24 24"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="flex-grow pl-6">
              <h2 className="title-font mb-2 text-lg font-medium text-gray-900">
                Automated Grading Made Simple
              </h2>
              <p className="text-base leading-relaxed">
                AceGrader takes the hassle out of grading. By configuring your
                desired marking scheme, our intelligent system automatically
                checks student answers against the preset criteria. The days of
                manually checking every response are over, allowing you to focus
                on providing valuable feedback and personalized attention to
                your students.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
