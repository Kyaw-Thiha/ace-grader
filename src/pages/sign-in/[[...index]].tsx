import type { NextPage } from "next";
import { SignIn } from "@clerk/nextjs";

const SignInPage: NextPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn />
    </div>
  );
};

export default SignInPage;
