import { api } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Dialog from "@components/Dialog";

interface Props {
  id: string;
  order: number;
  refetch: QueryObserverBaseResult["refetch"];
}

const AddQuestionButton: React.FC<Props> = ({ id, order, refetch }) => {
  const questionTypes = [
    "Multiple Choice Question",
    "Short Answer Question",
    "Long Answer Question",
  ];

  //Function for creating multiple choice question
  const createMultipleChoiceQuestion =
    api.multipleChoiceQuestion.create.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  //Function for creating short answer question
  const createShortAnswerQuestion = api.shortAnswerQuestion.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  //Function for creating long answer question
  const createLongAnswerQuestion = api.longAnswerQuestion.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  // Function to add question based on the given qeustion type
  const addQuestion = (
    questionType:
      | "Multiple Choice Question"
      | "Short Answer Question"
      | "Long Answer Question"
  ) => {
    const toastResponse = {
      pending: "Creating Question",
      success: "Question Created 👌",
      error: "Error in Question Creation 🤯",
    };

    if (questionType == "Multiple Choice Question") {
      void toast.promise(
        createMultipleChoiceQuestion.mutateAsync({
          id: id,
          text: "This is the question text for the question. Please edit this.",
          order: order,
        }),
        toastResponse
      );
    } else if (questionType == "Short Answer Question") {
      void toast.promise(
        createShortAnswerQuestion.mutateAsync({
          id: id,
          text: "This is the question text for the question. Please edit this.",
          order: order,
        }),
        toastResponse
      );
    } else if (questionType == "Long Answer Question") {
      void toast.promise(
        createLongAnswerQuestion.mutateAsync({
          id: id,
          text: "This is the question text for the question. Please edit this.",
          order: order,
        }),
        toastResponse
      );
    }
  };

  return (
    <>
      <div className="dropdown">
        <label tabIndex={0} className="btn-ghost btn m-1">
          Add Question
        </label>
        <div
          tabIndex={0}
          className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
        >
          {questionTypes.map((questionType) => {
            return (
              <div key={questionType}>
                <label htmlFor={questionType} className="btn-primary btn">
                  Create Worksheet
                </label>
              </div>
            );
          })}
        </div>
      </div>
      {questionTypes.map((questionType) => {
        return (
          <Dialog
            key={questionType}
            id={questionType}
            openContainer={<></>}
            body={
              <>
                <h3 className="mb-4 text-2xl font-bold">{questionType}</h3>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input-bordered input w-full max-w-xs"
                  // value={title} // ...force the input's value to match the state variable...
                  // onChange={(e) => setTitle(e.target.value)} // ... and update the state variable on any edits!
                />
              </>
            }
            actions={
              <label htmlFor={questionType} className="btn">
                Create Worksheet
              </label>
            }
          />
        );
      })}
    </>
  );
};

export default AddQuestionButton;
