import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Page: React.FC<Props> = ({ children }) => {
  return <div className="bg-white px-12 py-8">{children}</div>;
};

export default Page;
