import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { type RouterOutputs, api } from "@/utils/api";
import { X } from "lucide-react";
import { useState } from "react";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Questions = RouterOutputs["question"]["getAll"];
interface DeleteQuestionButtonProps {
  id: string;
  order: number;
  questions: Questions;
  refetch: QueryObserverBaseResult["refetch"];
}

export const DeleteQuestionButton: React.FC<DeleteQuestionButtonProps> = (
  props
) => {
  const [open, setOpen] = useState(false);

  //Function for deleting question
  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  //Function for editing question
  const editQuestion = api.question.editOrder.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const removeQuestion = () => {
    setOpen(false);

    void toast
      .promise(
        deleteQuestion.mutateAsync({
          id: props.id,
        }),
        {
          pending: "Removing Question",
          success: "Question Removed 👌",
          error: "Error in Question Deletion 🤯",
        }
      )
      .then(() => {
        for (const question of props.questions) {
          if (question.order > props.order) {
            editQuestion.mutate({ id: question.id, order: question.order - 1 });
          }
        }
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <X className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            <p>Note: This process is irreversible</p>
            <p>Are you sure you want to delete this question?</p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => removeQuestion()}>
            Delete Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface PublishWorksheetButtonProps {
  worksheetId: string;
  refetch: QueryObserverBaseResult["refetch"];
}

export const PublishWorksheetButton: React.FC<PublishWorksheetButtonProps> = (
  props
) => {
  const [open, setOpen] = useState(false);

  //Fetching the worksheet
  const { data: worksheet, refetch: refetchWorksheet } =
    api.worksheet.get.useQuery({ id: props.worksheetId });

  //Fetching the questions
  const { data: worksheetWithQuestions, refetch: refetchQuestions } =
    api.worksheet.getQuestions.useQuery({ id: props.worksheetId });
  const questions = worksheetWithQuestions?.questions ?? [];

  //  Determining the version
  const { data: publishedWorksheetCount } =
    api.publishedWorksheet.getCount.useQuery({ profileId: props.worksheetId });
  const count = publishedWorksheetCount ?? 0;
  const version = count + 1;

  //Creating the published worksheet
  const createWorksheet = api.publishedWorksheet.create.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const calculateTotalMarks = () => {
    let totalMarks = 0;
    for (const question of questions) {
      if (question.questionType == "MultipleChoiceQuestion") {
        const marks = question.multipleChoiceQuestion?.marks ?? 0;
        totalMarks = totalMarks + marks;
      }
      // else if (question.questionType == "ShortAnswerQuestion") {
      //   const marks = question.shortAnswerQuestion?.marks ?? 0;
      //   totalMarks = totalMarks + marks;
      // }
      if (question.questionType == "LongAnswerQuestion") {
        const marks = question.longAnswerQuestion?.marks ?? 0;
        totalMarks = totalMarks + marks;
      }
    }

    return totalMarks;
  };

  const createQuestionsPayload = () => {
    const questionsPayload = [];

    for (const question of questions) {
      const choices = [];
      const originalChoices = question.multipleChoiceQuestion?.choices ?? [];
      for (const choice of originalChoices) {
        choices.push({ index: choice.index ?? 1, text: choice.text ?? "" });
      }

      if (question.questionType == "MultipleChoiceQuestion") {
        questionsPayload.push({
          order: question.order,
          questionType: question.questionType,
          multipleChoiceQuestion: {
            create: {
              text: question.multipleChoiceQuestion?.text ?? "",
              explanation: question.multipleChoiceQuestion?.explanation ?? "",
              marks: question.multipleChoiceQuestion?.marks ?? 1,
              answer: question.multipleChoiceQuestion?.answer ?? 0,
              choices: {
                create: choices,
              },
            },
          },
        });
      }
      // else if (question.questionType == "ShortAnswerQuestion") {
      //   questionsPayload.push({
      //     order: question.order,
      //     questionType: question.questionType,
      //     shortAnswerQuestion: {
      //       create: {
      //         text: question.shortAnswerQuestion?.text ?? "",
      //         marks: question.shortAnswerQuestion?.marks ?? 1,
      //         answer: question.shortAnswerQuestion?.answer ?? "",
      //       },
      //     },
      //   });
      // }
      else if (question.questionType == "LongAnswerQuestion") {
        questionsPayload.push({
          order: question.order,
          questionType: question.questionType,
          longAnswerQuestion: {
            create: {
              text: question.longAnswerQuestion?.text ?? "",
              marks: question.longAnswerQuestion?.marks ?? 1,
              markingScheme: question.longAnswerQuestion
                ?.markingScheme as string[],
              explanation: question.longAnswerQuestion?.explanation ?? "",
              sampleAnswer: question.longAnswerQuestion?.sampleAnswer ?? "",
            },
          },
        });
      }
    }

    return questionsPayload;
  };

  //Publishing the worksheet
  const publishWorksheet = () => {
    setOpen(false);

    void toast.promise(
      createWorksheet.mutateAsync({
        title: worksheet?.title ?? "",
        totalMarks: calculateTotalMarks(),
        version: version,
        profileId: worksheet?.profileId ?? "",
        worksheetId: worksheet?.id ?? "",
        questions: createQuestionsPayload(),
      }),
      {
        pending: "Publishing Worksheet",
        success: "Worksheet Published 👌",
        error: "Error in Worksheet Publishing 🤯",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Publish</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publish Worksheet</DialogTitle>
          <DialogDescription>
            <p>
              Note: Future students answering will use the latest version of
              worksheet
            </p>
            <p>Are you sure you want to publish this worksheet version?</p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => publishWorksheet()}>
            Publish Worksheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
