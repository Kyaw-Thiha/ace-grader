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
import { getQuestionTypes } from "@/questions/derived/functions";

interface WorksheetContext {
  country: string;
  curriculum: string;
  subject: string;
}

interface Props {
  worksheetId?: string;
  parentQuestionId?: string;
  order: number;
  nestedLevel?: number;
  worksheetContext: WorksheetContext;
  refetch: QueryObserverBaseResult["refetch"];
}

const AddQuestionButton: React.FC<Props> = (props) => {
  const MAXNESTEDLEVEL = 3;

  // Function for creating parent question
  const createNestedQuestion = api.nestedQuestion.create.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const addNestedQuestion = () => {
    void toast.promise(
      createNestedQuestion.mutateAsync({
        order: props.order,
        worksheetId: props.worksheetId,
        parentId: props.parentQuestionId,
        text: "",
      }),
      {
        pending: "Creating Question",
        success: "Question Created 👌",
        error: "Error in Question Creation 🤯",
      }
    );
  };

  //Function for creating multiple choice question
  const createMultipleChoiceQuestion =
    api.multipleChoiceQuestion.create.useMutation({
      onSuccess: () => {
        void props.refetch();
      },
    });

  const addMultipleChoiceQuestion = () => {
    void toast.promise(
      createMultipleChoiceQuestion.mutateAsync({
        order: props.order,
        worksheetId: props.worksheetId,
        parentId: props.parentQuestionId,
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
      void props.refetch();
    },
  });

  const addShortAnswerQuestion = () => {
    void toast.promise(
      createShortAnswerQuestion.mutateAsync({
        order: props.order,
        worksheetId: props.worksheetId,
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

  //Function for creating open-ended question
  const createOpenEndedQuestion = api.openEndedQuestion.create.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const addOpenAddedQuestion = () => {
    void toast.promise(
      createOpenEndedQuestion.mutateAsync({
        order: props.order,
        worksheetId: props.worksheetId,
        parentId: props.parentQuestionId,
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

  //Function for creating essay question
  const createEssayQuestion = api.essayQuestion.create.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const addEssayQuestion = () => {
    void toast.promise(
      createEssayQuestion.mutateAsync({
        order: props.order,
        worksheetId: props.worksheetId,
        parentId: props.parentQuestionId,
        text: "",
        essayType: "",
        criteria: [],
      }),
      {
        pending: "Creating Question",
        success: "Question Created 👌",
        error: "Error in Question Creation 🤯",
      }
    );
  };

  /**
   * A function that generates the worksheet list to be used in dropdown
   * 
   * const questionTypes = [
    {
      label: "Multiple Choice",
      create: addMultipleChoiceQuestion,
    },
    {
      label: "Open-Ended",
      create: addOpenAddedQuestion,
    },
    {
      label: "Essay Question",
      create: addEssayQuestion,
    },
    {
      label: "Nested Question",
      create: addNestedQuestion,
    },
  ];
   * 
   * 
   */
  const questionTypes = getQuestionTypes(
    props.worksheetContext.country,
    props.worksheetContext.curriculum,
    props.worksheetContext.subject
  )?.map((questionType) => {
    let addFunction = () => {
      return;
    };

    if (questionType.baseType == "mcq") {
      addFunction = addMultipleChoiceQuestion;
    } else if (questionType.baseType == "open-ended") {
      addFunction = addOpenAddedQuestion;
    } else if (questionType.baseType == "essay") {
      addFunction = addEssayQuestion;
    }

    return { label: questionType.name, create: addFunction };
  });

  if (props.nestedLevel && props.nestedLevel >= MAXNESTEDLEVEL) {
    questionTypes?.pop();
  }

  const getButtonVariant = () => {
    if (props.nestedLevel == 2) {
      return "outline";
    } else if (props.nestedLevel == 3) {
      return "ghost";
    } else {
      return "default";
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-[180px]" variant={getButtonVariant()}>
            Add Question
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[180px]">
          <DropdownMenuLabel>Types</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {questionTypes?.map((questionType) => {
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
