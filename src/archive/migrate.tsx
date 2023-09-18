import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import type { NextPage } from "next";

const MigratePage: NextPage = () => {
  const { data: worksheet, isLoading: worksheetLoading } =
    api.worksheet.getAll.useQuery();

  const { data: publishedWorksheet, isLoading: publishedWorksheetLoading } =
    api.publishedWorksheet.getAll.useQuery();

  const editCourse = api.worksheet.editCourse.useMutation({});
  const editPublishedCourse = api.publishedWorksheet.editCourse.useMutation({});

  const migrateLongAnswerQuestions = async () => {
    const worksheets = worksheet ?? [];

    for (const worksheet of worksheets) {
      console.log(worksheet);
      await editCourse.mutateAsync({
        id: worksheet.id,
        country: "default",
        curriculum: "default",
        subject: "default",
      });
    }
  };

  const migrateLongAnswerQuestionAnswers = async () => {
    const publishedWorksheets = publishedWorksheet ?? [];
    for (const publishedWorksheet of publishedWorksheets) {
      console.log(publishedWorksheet.id);
      await editPublishedCourse.mutateAsync({
        id: publishedWorksheet.id,
        country: "default",
        curriculum: "default",
        subject: "default",
      });
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Button
        disabled={worksheetLoading}
        onClick={() => void migrateLongAnswerQuestions()}
      >
        Migrate Worksheet
      </Button>
      <Button
        disabled={publishedWorksheetLoading}
        onClick={() => void migrateLongAnswerQuestionAnswers()}
      >
        Migrate Published Worksheet
      </Button>
    </div>
  );
};

export default MigratePage;
