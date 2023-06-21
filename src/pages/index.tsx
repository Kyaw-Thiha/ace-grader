import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          <div className="mr-8">
            <h1 className="text-5xl font-bold">Box Office News!</h1>
            <p className="py-6 text-lg">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <Link href="/sign-in">
              <button className="btn-primary btn">Get Started</button>
            </Link>
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
