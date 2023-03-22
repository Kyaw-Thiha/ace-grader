import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import Dialog from "@components/Dialog";

interface Props {
  id: string;
  order: number;
  refetch: QueryObserverBaseResult["refetch"];
}

const MultipleChoiceQuestionDialog: React.FC<Props> = ({
  id,
  order,
  refetch,
}) => {
  const [text, setText] = useState(
    "This is the question text for the question. Please edit this."
  );
  const [explanation, setExplanation] = useState("");
  const [answer, setAnswer] = useState(-1);
  const [marks, setMarks] = useState(1);

  const [choices, setChoices] = useState([]);

  //Function for creating multiple choice question
  const createMultipleChoiceQuestion =
    api.multipleChoiceQuestion.create.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  //Function for creating multiple choice question
  const createMultipleChoiceQuestionOption =
    api.multipleChoiceQuestion.addChoice.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  const addQuestion = () => {
    void toast.promise(
      createMultipleChoiceQuestion.mutateAsync({
        id: id,
        order: order + 1,
        text: text,
        explanation: explanation,
        marks: marks,
        answer: answer,
        choices: choices,
      }),
      {
        pending: "Creating Question",
        success: "Question Created 👌",
        error: "Error in Question Creation 🤯",
      }
    );
  };

  return (
    <Dialog
      id="multiple-choice-question-dialog"
      openContainer={<></>}
      body={
        <>
          <h3 className="mb-4 text-2xl font-bold">Create</h3>
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
        <label htmlFor="multiple-choice-question-dialog" className="btn">
          Create Worksheet
        </label>
      }
    />
  );
};

export default MultipleChoiceQuestionDialog;
