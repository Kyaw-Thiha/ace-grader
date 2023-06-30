import type { NextPage } from "next";
import { SignIn } from "@clerk/nextjs";
import TopNavLayout from "@/components/TopNavLayout";

const SignInPage: NextPage = () => {
  return (
    <TopNavLayout>
      <div className="mt-32 flex items-center justify-center">
        <SignIn />
      </div>
    </TopNavLayout>
  );
};

export default SignInPage;
