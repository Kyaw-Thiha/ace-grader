import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { type RouterOutputs, api } from "@/utils/api";
import type { QueryObserverBaseResult } from "@tanstack/react-query";
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
import { ShareLinkGuideDialog } from "@/components/worksheet/ShareLinkGuideDialog";

// https://github.com/jherr/notetaker
type Profile = RouterOutputs["teacherProfile"]["getWorksheets"];

const MyWorksheets: NextPage = () => {
  //Fetching list of worksheets
  const {
    data: profile,
    refetch,
    isLoading,
    isError,
  } = api.teacherProfile.getWorksheets.useQuery(
    undefined // no input
  );

  return (
    <TopNavLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">My Worksheets</h1>
        <div className="flex gap-4">
          {!isLoading ? (
            <AddWorksheetButton
              profile={profile as Profile}
              refetch={refetch}
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      <WorksheetList
        profile={profile as Profile}
        refetch={refetch}
        isLoading={isLoading}
        isError={isError}
      />
    </TopNavLayout>
  );
};

export default MyWorksheets;

interface Props {
  profile: Profile;
  refetch: QueryObserverBaseResult["refetch"];
  isLoading: boolean;
  isError: boolean;
}
const WorksheetList: React.FC<Props> = (props) => {
  // Automatically animate the list add and delete
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  const router = useRouter();

  // //Fetching list of worksheets
  // const {
  //   data: profile,
  //   refetch: refetchProfiles,
  //   isLoading,
  //   isError,
  // } = api.teacherProfile.getWorksheets.useQuery(
  //   undefined // no input
  // );

  const worksheets = props.profile?.worksheets ?? [];

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

  if (props.isLoading) {
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
          <AddWorksheetButton profile={props.profile} refetch={props.refetch} />
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
              className="flex w-full items-center justify-start rounded-lg px-4 py-2 transition-all hover:bg-accent hover:text-accent-foreground active:bg-blue-100 dark:active:bg-sky-950/60"
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
                  <span className="whitespace-nowrap">Answer Sheets</span>
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
        <ShareLinkGuideDialog profile={props.profile} />
      </div>
    );
  }
};
