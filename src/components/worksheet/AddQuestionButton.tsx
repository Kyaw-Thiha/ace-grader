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
  id: string;
  order: number;
  refetch: QueryObserverBaseResult["refetch"];
}

const AddQuestionButton: React.FC<Props> = ({ id, order, refetch }) => {
  //Function for creating multiple choice question
  const createMultipleChoiceQuestion =
    api.multipleChoiceQuestion.create.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  const addMultipleChoiceQuestion = () => {
    void toast.promise(
      createMultipleChoiceQuestion.mutateAsync({
        order: order,
        worksheetId: id,
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
        worksheetId: id,
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
  const createLongAnswerQuestion = api.longAnswerQuestion.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const addLongAnwerQuestion = () => {
    void toast.promise(
      createLongAnswerQuestion.mutateAsync({
        order: order,
        worksheetId: id,
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
      dialogId: "create-multiple-choice-question",
      create: addMultipleChoiceQuestion,
    },
    // {
    //   label: "Short Answer",
    //   dialogId: "create-short-answer-question",
    //   create: addShortAnswerQuestion,
    // },
    {
      label: "Long Answer",
      dialogId: "create-long-answer-question",
      create: addLongAnwerQuestion,
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
