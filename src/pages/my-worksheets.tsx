import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

import { api } from "@/utils/api";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "react-toastify";

// https://github.com/jherr/notetaker

const MyWorksheets: NextPage = () => {
  return (
    <>
      <div className="mx-8 mt-8 flex items-center justify-between">
        <h1 className=" text-4xl">My Worksheets</h1>
        <div className="flex gap-4">
          <Link href="/answer-sheets">
            <button className="btn-ghost btn">Answer Sheets</button>
          </Link>
          <AddWorksheetButton />
        </div>
      </div>

      <WorksheetList />
    </>
  );
};

export default MyWorksheets;

const WorksheetList: React.FC = () => {
  // Automatically animate the list add and delete
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  //Fetching list of worksheets
  const {
    data: profiles,
    refetch: refetchProfiles,
    isLoading,
    isError,
  } = api.teacherProfile.getWorksheets.useQuery(
    undefined // no input
  );

  const worksheets = profiles?.at(0)?.worksheets ?? [];

  // Fetching the corresponding latest published worksheet
  const [copyWorksheetId, setCopyWorksheetId] = useState("");
  const { data: worksheet, refetch: refetchPublishedWorksheet } =
    api.worksheet.getPublishedWorksheetLatestVersion.useQuery(
      { id: copyWorksheetId },
      { enabled: false }
    );

  const copyLink = async (worksheetId: string) => {
    setCopyWorksheetId(worksheetId);
    await refetchPublishedWorksheet();

    void navigator.clipboard.writeText(
      `${window.location.origin}/published-worksheets/${
        worksheet?.publishedWorksheets.at(0)?.id ?? ""
      }`
    );

    toast.success("Link copied to your clipboard");
  };

  if (isLoading) {
    return <Loading />;
  } else if (worksheets?.length == 0) {
    //Empty worksheets
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-16">
        <Image
          src="/images/illustrations/empty_worksheet.svg"
          alt="Empty Worksheet Image"
          width="350"
          height="350"
        />
        <div className="flex items-center justify-center">
          <AddWorksheetButton />
        </div>
      </div>
    );
  } else {
    return (
      <div className="mx-8 mt-8" ref={parent}>
        {worksheets.map((worksheet) => (
          <div
            key={worksheet.id}
            className="mb-4 flex items-stretch justify-between"
          >
            <Link
              href={`/worksheets/${worksheet.id}`}
              className="flex w-full items-center justify-start rounded-lg px-4 py-2 transition-all hover:bg-gray-200 active:bg-gray-100"
            >
              <div className="flex flex-col items-start">
                <h2 className="mb-2 text-xl font-semibold">
                  {worksheet.title}
                </h2>
                <h3>
                  {" "}
                  {`Last Edited: ${worksheet.lastEdited.toLocaleDateString()}`}{" "}
                </h3>
              </div>
            </Link>

            <div className="mx-4 flex items-center justify-center">
              {worksheet.publishedWorksheets.length > 0 && (
                <button
                  className="btn-primary btn-outline btn-circle btn text-xl"
                  onClick={() => void copyLink(worksheet.id)}
                >
                  🔗
                </button>
              )}

              <DeleteWorksheetButton
                worksheetId={worksheet.id}
                worksheetTitle={worksheet.title}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
};

const AddWorksheetButton: React.FC = () => {
  const [title, setTitle] = useState("");

  const { data, refetch: refetchProfiles } =
    api.teacherProfile.getWorksheets.useQuery(
      undefined // no input
    );

  //Fetching the teacher profiles
  const { data: profiles } = api.teacherProfile.getAll.useQuery(
    undefined // no input
  );

  //Function for creating worksheet
  const createWorksheet = api.worksheet.create.useMutation({
    onSuccess: () => {
      void refetchProfiles();
    },
  });

  const addWorksheet = () => {
    if (title.trim() == "") {
      // If title is not entered
      toast.error("Enter a title");
    } else if (title.split(" ").length > 20) {
      // If title is above word limit
      toast.error("Your title cannot have more than 20 words");
    } else if (title.length > 250) {
      // If title is above character limit
      toast.error("Your title cannot have more than 250 characters");
    } else {
      void toast.promise(
        createWorksheet.mutateAsync({
          title: title,
          profileId: profiles?.at(0)?.id ?? "",
        }),
        {
          pending: "Creating Worksheet",
          success: "Worksheet Created 👌",
          error: "Error in Worksheet Creation 🤯",
        }
      );
    }

    setTitle("");
  };

  return (
    <>
      <Dialog
        id="add-worksheet"
        openContainer={
          <label htmlFor="add-worksheet" className="btn-primary btn">
            Create Worksheet
          </label>
        }
        body={
          <>
            <h3 className="mb-4 text-2xl font-bold">Create Worksheet</h3>
            <input
              type="text"
              placeholder="Type here"
              className="input-bordered input w-full max-w-xs"
              value={title} // ...force the input's value to match the state variable...
              onChange={(e) => setTitle(e.target.value)} // ... and update the state variable on any edits!
            />
          </>
        }
        actions={
          <label htmlFor="add-worksheet" className="btn" onClick={addWorksheet}>
            Create Worksheet
          </label>
        }
      />
    </>
  );
};

interface DeleteWorksheetButtonProps {
  worksheetId: string;
  worksheetTitle: string;
}

const DeleteWorksheetButton: React.FC<DeleteWorksheetButtonProps> = ({
  worksheetId,
  worksheetTitle,
}) => {
  const [text, setText] = useState("");

  const { data, refetch: refetchProfiles } =
    api.teacherProfile.getWorksheets.useQuery(
      undefined // no input
    );

  //Function for creating worksheet
  const deleteWorksheet = api.worksheet.delete.useMutation({
    onSuccess: () => {
      void refetchProfiles();
    },
  });

  const removeWorksheet = () => {
    if (text != worksheetTitle) {
      // If title is not entered
      toast.error("Your input text is incorrect");
    } else {
      void toast.promise(
        deleteWorksheet.mutateAsync({
          id: worksheetId,
        }),
        {
          pending: "Removing Worksheet",
          success: "Worksheet Removed 👌",
          error: "Error in Worksheet Deletion 🤯",
        }
      );
    }

    setText("");
  };

  return (
    <>
      <Dialog
        id="delete-worksheet"
        openContainer={
          <label htmlFor="delete-worksheet" className="btn-primary btn">
            Delete Worksheet
          </label>
        }
        body={
          <>
            <h3 className="mb-4 text-2xl font-bold">Delete Worksheet</h3>
            <h4 className="mb-2">Note: This process is irreversible</h4>
            <p className="mb-6">
              Please type in<b className="ml-2">{worksheetTitle}</b> below to
              proceed with worksheet removal
            </p>
            <input
              type="text"
              placeholder="Type here"
              className="input-bordered input w-full max-w-xs"
              value={text} // ...force the input's value to match the state variable...
              onChange={(e) => setText(e.target.value)} // ... and update the state variable on any edits!
            />
          </>
        }
        actions={
          <label
            htmlFor="delete-worksheet"
            className="btn-warning btn"
            onClick={removeWorksheet}
          >
            Delete Worksheet
          </label>
        }
      />
    </>
  );
};
