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
import { useRouter } from "next/router";

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
  const router = useRouter();

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
    api.publishedWorksheet.getCount.useQuery({
      worksheetId: props.worksheetId,
    });
  const count = publishedWorksheetCount ?? 0;
  const version = count + 1;

  /**
   *  Ensure that the action text is
   *  - Publish when not published before
   *  - Save when worksheet has been published before
   */
  const actionText = publishedWorksheetCount == 0 ? "Publish" : "Save";

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
      if (question.questionType == "MultipleChoiceQuestion") {
        // Copying the choices
        const choices = [];
        const originalChoices = question.multipleChoiceQuestion?.choices ?? [];
        for (const choice of originalChoices) {
          choices.push({ index: choice.index ?? 1, text: choice.text ?? "" });
        }

        // Copying the images
        const images = [];
        const originalImages = question.multipleChoiceQuestion?.images ?? [];
        for (const image of originalImages) {
          images.push({
            url: image.url,
            fileKey: image.fileKey,
            caption: image.caption,
          });
        }

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
              images: {
                create: images,
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
        // Copying the images
        const images = [];
        const originalImages = question.longAnswerQuestion?.images ?? [];
        for (const image of originalImages) {
          images.push({
            url: image.url,
            fileKey: image.fileKey,
            caption: image.caption,
          });
        }

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
              images: {
                create: images,
              },
            },
          },
        });
      }
    }

    return questionsPayload;
  };

  //Publishing the worksheet
  const publishWorksheet = async () => {
    setOpen(false);

    await toast.promise(
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

    await router.push("/worksheets");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{actionText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{actionText} Worksheet</DialogTitle>
          <DialogDescription>
            <p>
              Note: Future students answering will use the latest version of
              worksheet
            </p>
            <p>
              Are you sure you want to {actionText.toLocaleLowerCase()} this
              worksheet version?
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => void publishWorksheet()}>
            {actionText} Worksheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
