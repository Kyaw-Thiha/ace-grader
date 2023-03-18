import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Autosave, useAutosave } from "react-autosave";
import { api } from "@utils/api";

const WorksheetEditor: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);

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
        <WorksheetHeader worksheetId={id as string} />
      </main>
    </>
  );
};

export default WorksheetEditor;

// https://www.npmjs.com/package/react-autosave
interface WorksheetHeaderProps {
  worksheetId: string;
}

const WorksheetHeader: React.FC<WorksheetHeaderProps> = ({ worksheetId }) => {
  //Fetching the worksheet
  const { data: worksheet } = api.worksheet.get.useQuery(
    { id: worksheetId },
    {
      onSuccess: () => {
        setTitle(worksheet?.title ?? "");
      },
    }
  );
  console.log(worksheet);

  const [title, setTitle] = useState("");

  const updateTitle = () => {
    return;
  };
  useAutosave({ data: title, onSave: updateTitle });

  return (
    <>
      <div className="navbar backdrop-blur-lg">
        <div className="mt-4 flex-1">
          <input
            type="text"
            placeholder="Type here"
            className="input-bordered input w-full max-w-xs"
            value={title} // ...force the input's value to match the state variable...
            onChange={(e) => setTitle(e.target.value)} // ... and update the state variable on any edits!
          />
        </div>
        <div className="flex-none">
          <button className="btn-primary btn">Publish</button>
        </div>
      </div>
    </>
  );
};
