import type { NextPage } from "next";
import { SignUp } from "@clerk/nextjs";

const SignUpPage: NextPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
