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
import type { CreateQuestion } from "@/components/worksheet/types";

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

  //Function for deleting nested question's children
  const deleteNestedChildrenQuestion =
    api.nestedQuestion.deleteNestedChildren.useMutation();
  const deleteChildrenQuestion =
    api.nestedQuestion.deleteChildren.useMutation();

  const removeNestedQuestion = async () => {
    await deleteNestedChildrenQuestion.mutateAsync({ id: props.id });
    await deleteChildrenQuestion.mutateAsync({ id: props.id });
    await deleteQuestion.mutateAsync({ id: props.id });
  };

  //Function for editing question
  const editQuestion = api.question.editOrder.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const removeQuestion = () => {
    setOpen(false);

    const question = props.questions.find((obj) => {
      return obj.id === props.id;
    });

    if (question?.questionType == "NestedQuestion") {
      void toast
        .promise(removeNestedQuestion, {
          pending: "Removing Question",
          success: "Question Removed 👌",
          error: "Error in Question Deletion 🤯",
        })
        .then(() => {
          for (const question of props.questions) {
            if (question.order > props.order) {
              editQuestion.mutate({
                id: question.id,
                order: question.order - 1,
              });
            }
          }
        });
    } else {
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
              editQuestion.mutate({
                id: question.id,
                order: question.order - 1,
              });
            }
          }
        });
    }
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
type Question = RouterOutputs["question"]["getQuestion"];

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

  //Fetching list of worksheets
  const { refetch: fetchProfile } = api.teacherProfile.getWorksheets.useQuery(
    undefined,
    { enabled: false }
  );

  //Creating the published worksheet
  const createWorksheet = api.publishedWorksheet.create.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const calculateTotalMarks = (questions: Question[]) => {
    let totalMarks = 0;
    for (const question of questions) {
      if (question?.questionType == "MultipleChoiceQuestion") {
        const marks = question.multipleChoiceQuestion?.marks ?? 0;
        totalMarks = totalMarks + marks;
      }
      if (question?.questionType == "OpenEndedQuestion") {
        const marks = question.openEndedQuestion?.marks ?? 0;
        totalMarks = totalMarks + marks;
      }
      if (question?.questionType == "NestedQuestion") {
        const marks = calculateTotalMarks(
          question.nestedQuestion?.childrenQuestions ?? []
        );
        totalMarks = totalMarks + marks;
      }
    }

    return totalMarks;
  };

  const createQuestionsPayload = (questions: Question[]) => {
    const questionsPayload: CreateQuestion[] = [];

    for (const question of questions) {
      if (question?.questionType == "MultipleChoiceQuestion") {
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
      } else if (question?.questionType == "OpenEndedQuestion") {
        // Copying the images
        const images = [];
        const originalImages = question.openEndedQuestion?.images ?? [];
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
          openEndedQuestion: {
            create: {
              text: question.openEndedQuestion?.text ?? "",
              marks: question.openEndedQuestion?.marks ?? 1,
              markingScheme: question.openEndedQuestion
                ?.markingScheme as string[],
              explanation: question.openEndedQuestion?.explanation ?? "",
              sampleAnswer: question.openEndedQuestion?.sampleAnswer ?? "",
              images: {
                create: images,
              },
            },
          },
        });
      } else if (question?.questionType == "NestedQuestion") {
        // Copying the images
        const images = [];
        const originalImages = question.openEndedQuestion?.images ?? [];
        for (const image of originalImages) {
          images.push({
            url: image.url,
            fileKey: image.fileKey,
            caption: image.caption,
          });
        }

        const nestedQuestions = createQuestionsPayload(
          question.nestedQuestion?.childrenQuestions ?? []
        );
        questionsPayload.push({
          order: question.order,
          questionType: question.questionType,
          nestedQuestion: {
            create: {
              text: question.nestedQuestion?.text ?? "",
              images: {
                create: images,
              },
              childrenQuestions: {
                create: nestedQuestions,
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
        totalMarks: calculateTotalMarks(questions),
        version: version,
        profileId: worksheet?.profileId ?? "",
        worksheetId: worksheet?.id ?? "",
        questions: createQuestionsPayload(questions),
      }),
      {
        pending: "Publishing Worksheet",
        success: "Worksheet Published 👌",
        error: "Error in Worksheet Publishing 🤯",
      }
    );

    await fetchProfile();
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
