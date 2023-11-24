import type { GetServerSidePropsContext, NextPage } from "next";
import { SubmitCodeForm } from ".";

export function getServerSideProps(context: GetServerSidePropsContext) {
  const code = context.params?.["code"];
  const joinCode = code as string;

  return {
    props: {
      code: joinCode,
    },
  };
}

interface Props {
  code: string;
}

const JoinWithCodePage: NextPage<Props> = (props) => {
  return <SubmitCodeForm code={props.code} />;
};

export default JoinWithCodePage;
