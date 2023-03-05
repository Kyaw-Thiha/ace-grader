import { type NextPage } from "next";
import Link from "next/link";
import { useSession } from "next-auth/react";

const NavBar: NextPage = () => {
  return (
    <div className="navbar fixed backdrop-blur-lg">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-2xl normal-case">
          Worksheesh
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
      <Link href="/">
        <button className="btn-primary btn">Dashboard</button>
      </Link>
    );
  } else {
    return (
      <Link href="/">
        <button className="btn-primary btn">Sign In</button>
      </Link>
    );
  }
};
