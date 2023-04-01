import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "@utils/api";

const Answer: NextPage = () => {
  const router = useRouter();
  const { isReady } = router;
  const { id } = router.query;

  const { data: sessionData } = useSession();
  const isLoggedIn = sessionData?.user !== undefined;

  return (
    <>
      <Head>
        <title>Worksheesh</title>
        <meta name="description" content="Worksheeet Editor" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main>
        <main className="min-h-screen bg-slate-300">
          {isReady ? (
            <>
              {isLoggedIn ? (
                <StudentCredentialsForm id={id as string} />
              ) : (
                <StudentCredentialsForm id={id as string} />
              )}
            </>
          ) : (
            <></>
          )}
        </main>
      </main>
    </>
  );
};

export default Answer;

interface Props {
  id: string;
}

const RedirectIfLoggedIn: React.FC<Props> = (props) => {
  const router = useRouter();

  //Fetching list of worksheets
  const {
    data: profiles,
    refetch: refetchProfiles,
    isLoading,
    isError,
  } = api.teacherProfile.getPublishedWorksheets.useQuery(
    undefined // no input
  );
  const publishedWorksheets = profiles?.at(0)?.publishedWorksheets ?? [];

  if (publishedWorksheets.some((e) => e.id == props.id)) {
    // If the user is the teacher who created the worksheet, redirect to the sample answer paper
    void router.replace(`published-worksheets/${props.id}/answer`);
    return <></>;
  } else {
    return <StudentCredentialsForm id={props.id} />;
  }
};

const StudentCredentialsForm: React.FC<Props> = (props) => {
  return (
    <div className="flex min-h-screen items-center justify-center">Hi Hi</div>
  );
};
