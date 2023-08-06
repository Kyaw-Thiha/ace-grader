import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { api } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface Props {
  worksheetId?: string;
  nestedQuestionId?: string;
  order: number;
  refetch: QueryObserverBaseResult["refetch"];
}

const AddQuestionButton: React.FC<Props> = ({
  worksheetId,
  order,
  refetch,
}) => {
  //Function for creating parent question
  const createNestedQuestion = api.nestedQuestion.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const addNestedQuestion = () => {
    return;
  };

  //Function for creating multiple choice question
  const createMultipleChoiceQuestion =
    api.multipleChoiceQuestion.create.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  const addMultipleChoiceQuestion = () => {
    void toast.promise(
      worksheetId
        ? createMultipleChoiceQuestion.mutateAsync({
            order: order,
            worksheetId: worksheetId,
            text: "",
            explanation: "",
            marks: 1,
            answer: 1,
            choices: [
              {
                index: 1,
                text: "",
              },
              {
                index: 2,
                text: "",
              },
              {
                index: 3,
                text: "",
              },
              {
                index: 4,
                text: "",
              },
            ],
          })
        : createMultipleChoiceQuestion.mutateAsync({
            order: order,
            worksheetId: worksheetId,
            text: "",
            explanation: "",
            marks: 1,
            answer: 1,
            choices: [
              {
                index: 1,
                text: "",
              },
              {
                index: 2,
                text: "",
              },
              {
                index: 3,
                text: "",
              },
              {
                index: 4,
                text: "",
              },
            ],
          }),
      {
        pending: "Creating Question",
        success: "Question Created 👌",
        error: "Error in Question Creation 🤯",
      }
    );
  };

  //Function for creating multiple choice question
  const createShortAnswerQuestion = api.shortAnswerQuestion.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const addShortAnswerQuestion = () => {
    void toast.promise(
      createShortAnswerQuestion.mutateAsync({
        order: order,
        worksheetId: worksheetId,
        text: "",
        explanation: "",
        marks: 1,
        answer:
          "This is the exact answer that will be automatically checked to student answer",
      }),
      {
        pending: "Creating Question",
        success: "Question Created 👌",
        error: "Error in Question Creation 🤯",
      }
    );
  };

  //Function for creating multiple choice question
  const createOpenEndedQuestion = api.openEndedQuestion.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const addOpenAddedQuestion = () => {
    void toast.promise(
      createOpenEndedQuestion.mutateAsync({
        order: order,
        worksheetId: worksheetId,
        text: "",
        marks: 1,
      }),
      {
        pending: "Creating Question",
        success: "Question Created 👌",
        error: "Error in Question Creation 🤯",
      }
    );
  };

  const questionTypes = [
    {
      label: "Multiple Choice",
      create: addMultipleChoiceQuestion,
    },
    // {
    //   label: "Short Answer",
    //   dialogId: "create-short-answer-question",
    //   create: addShortAnswerQuestion,
    // },
    {
      label: "Open-Ended",
      create: addOpenAddedQuestion,
    },
  ];

  return (
    <>
      {/* <div className="dropdown">
        <label tabIndex={0} className="btn-ghost btn m-1">
          Add Question
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box bg-base-100 w-52 gap-3 p-2 shadow"
        >
          {questionTypes.map((questionType) => {
            return (
              <li key={questionType.label} className="w-full ">
                <button
                  className="btn-ghost btn"
                  onClick={() => questionType.create()}
                >
                  {questionType.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-[180px]">Add Question</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[180px]">
          <DropdownMenuLabel>Types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {questionTypes.map((questionType) => {
            return (
              <DropdownMenuItem
                key={questionType.label}
                onClick={() => questionType.create()}
              >
                {questionType.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default AddQuestionButton;
