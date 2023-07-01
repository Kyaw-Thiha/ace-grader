import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Share2 } from "lucide-react";

import Loading from "@/components/Loading";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "react-toastify";
import {
  AddWorksheetButton,
  DeleteWorksheetButton,
} from "@/components/worksheet/WorksheetDialogs";
import { Button } from "@/components/ui/button";
import TopNavLayout from "@/components/TopNavLayout";

// https://github.com/jherr/notetaker

const MyWorksheets: NextPage = () => {
  return (
    <TopNavLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">My Worksheets</h1>
        <div className="flex gap-4">
          <Button asChild variant="ghost">
            <Link href="/answer-sheets">
              <button>Answer Sheets</button>
            </Link>
          </Button>

          <AddWorksheetButton />
        </div>
      </div>

      <WorksheetList />
    </TopNavLayout>
  );
};

export default MyWorksheets;

const WorksheetList: React.FC = () => {
  // Automatically animate the list add and delete
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const router = useRouter();

  //Fetching list of worksheets
  const {
    data: profile,
    refetch: refetchProfiles,
    isLoading,
    isError,
  } = api.teacherProfile.getWorksheets.useQuery(
    undefined // no input
  );

  const worksheets = profile?.worksheets ?? [];

  // Fetching the corresponding latest published worksheet
  const [chosenWorksheetId, setChosenWorksheetId] = useState("");
  const { data: worksheet, refetch: refetchPublishedWorksheet } =
    api.worksheet.getPublishedWorksheetLatestVersion.useQuery(
      { id: chosenWorksheetId },
      { enabled: false }
    );

  const openDashboard = async (worksheetId: string) => {
    // const worksheet = worksheets.find((obj) => {
    //   return obj.id == worksheetId;
    // });
    // const latestPublishedWorksheet =
    //   worksheet?.publishedWorksheets.at(0)?.id ?? "";

    // await router.push(`/published-worksheets/${latestPublishedWorksheet}`);

    await router.push(`worksheets/${worksheetId}/dashboard`);
  };

  const copyLink = (worksheetId: string) => {
    // setChosenWorksheetId(worksheetId);
    // const res = await refetchPublishedWorksheet();
    // const publishedWorksheetId = res.data?.publishedWorksheets.at(0)?.id ?? "";
    const worksheet = worksheets.find((obj) => {
      return obj.id == worksheetId;
    });
    const latestPublishedWorksheet =
      worksheet?.publishedWorksheets.at(0)?.id ?? "";

    void navigator.clipboard.writeText(
      `${window.location.origin}/published-worksheets/${latestPublishedWorksheet}`
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
      <div className="mt-8" ref={parent}>
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
                  {`Last Edited: ${worksheet.lastEdited.toLocaleDateString()}`}
                </h3>
              </div>
            </Link>

            <div className="mx-4 flex items-center justify-center gap-2">
              {worksheet.publishedWorksheets.length > 0 && (
                <Button
                  variant={"outline"}
                  onClick={() => void openDashboard(worksheet.id)}
                >
                  Dashboard
                </Button>
              )}

              {worksheet.publishedWorksheets.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => void copyLink(worksheet.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
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