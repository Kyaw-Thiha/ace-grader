import { type NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

const NavBar: NextPage = () => {
  return (
    <div className="navbar backdrop-blur-lg">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-2xl normal-case">
          <Image
            src="/images/logo-icon.png"
            alt="Logo"
            width="32"
            height="32"
          />
          <h2 className="ml-2">SmartGrader</h2>
        </Link>
      </div>
      <div className="flex-none">
        <NavActions />
      </div>
    </div>
  );
};

export default NavBar;

const NavActions: React.FC = () => {
  const { data: sessionData } = useSession();
  const isLoggedIn = sessionData?.user !== undefined;

  if (isLoggedIn) {
    return (
      <Link href="/my-worksheets">
        <button className="btn-primary btn">Dashboard</button>
      </Link>
    );
  } else {
    return (
      <Link href="/sign-in">
        <button className="btn-primary btn">Sign In</button>
      </Link>
    );
  }
};
