import type { NextPage } from "next";
import { SignUp } from "@clerk/nextjs";
import TopNavLayout from "@/components/TopNavLayout";

const SignUpPage: NextPage = () => {
  return (
    <TopNavLayout>
      <div className="mt-32 flex h-screen items-center justify-center">
        <SignUp />
      </div>
    </TopNavLayout>
  );
};

export default SignUpPage;
