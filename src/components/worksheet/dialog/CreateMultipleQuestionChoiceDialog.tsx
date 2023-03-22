import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import Dialog from "@components/Dialog";

interface Props {
  worksheetId: string;
  dialogId: string;
  order: number;
  refetch: QueryObserverBaseResult["refetch"];
}

// https://levelup.gitconnected.com/adding-katex-and-markdown-in-react-7b70694004ef
const CreateMultipleChoiceQuestionDialog: React.FC<Props> = ({
  worksheetId,
  dialogId,
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
        id: worksheetId,
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
      id={dialogId}
      className="min-w-[60vw]"
      openContainer={<></>}
      body={
        <>
          <h3 className="mb-4 text-2xl font-bold">
            Create Multiple Choice Question
          </h3>
          <div className="mt-8 w-full">
            <div className="my-4 items-center gap-2">
              <p>Question Text: </p>
              <input
                type="text"
                placeholder="Type your text here"
                className="input-bordered input w-full max-w-xs"
                value={text} // ...force the input's value to match the state variable...
                onChange={(e) => {
                  if (e.target.value == "") {
                    toast.error("The text cannot be empty");
                  } else {
                    setText(e.target.value);
                  }
                }} // ... and update the state variable on any edits!
              />
            </div>
            <div className="my-4 flex items-center gap-2">
              <p>Explanation: </p>
              <input
                type="text"
                placeholder="Type your text here"
                className="input-bordered input w-full max-w-xs"
                value={text} // ...force the input's value to match the state variable...
                onChange={(e) => {
                  if (e.target.value == "") {
                    toast.error("The text cannot be empty");
                  } else {
                    setText(e.target.value);
                  }
                }} // ... and update the state variable on any edits!
              />
            </div>
          </div>
        </>
      }
      actions={
        <label htmlFor={dialogId} className="btn" onClick={addQuestion}>
          Create Question
        </label>
      }
    />
  );
};

export default CreateMultipleChoiceQuestionDialog;
