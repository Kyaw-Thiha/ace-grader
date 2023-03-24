import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-toastify";
import { api } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Dialog from "@components/Dialog";

interface Props {
  worksheetId: string;
  dialogId: string;
  order: number;
  refetch: QueryObserverBaseResult["refetch"];
}

interface Choice {
  index: number;
  text: string;
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
  const [prevText, setPrevText] = useState(
    "This is the question text for the question. Please edit this."
  );
  const [explanation, setExplanation] = useState("");
  const [answer, setAnswer] = useState(0);
  const [marks, setMarks] = useState(1);
  const [prevMarks, setPrevMarks] = useState(1);

  const [choices, setChoices] = useState<Array<Choice>>([]);

  //Function for creating multiple choice question
  const createMultipleChoiceQuestion =
    api.multipleChoiceQuestion.create.useMutation({
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

  // Automatically animate the list add and delete
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

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

          <div className="col mt-8 grid grid-cols-4 items-center gap-y-4">
            <p className="col-span-1">Question Text: </p>
            <input
              type="text"
              placeholder="Type your text here"
              className="input-bordered input col-span-3 "
              value={text} // ...force the input's value to match the state variable...
              onChange={(e) => {
                if (e.target.value == "") {
                  toast.error("The text cannot be empty");
                } else {
                  setText(e.target.value);
                }
              }} // ... and update the state variable on any edits!
            />

            <div className="col-span-4" ref={parent}>
              {choices.map((choice) => {
                return (
                  <div className="flex gap-2" key={choice.index}>
                    <p>
                      {String.fromCharCode(97 + choice.index - 1).toUpperCase()}
                      :
                    </p>
                    <p>{choice.text}</p>
                  </div>
                );
              })}
            </div>

            <button
              className="btn-outline btn-primary btn col-span-2 max-w-sm text-lg"
              onClick={() => {
                setChoices([
                  ...choices,
                  {
                    index: choices.length + 1,
                    text: `Choice - ${choices.length + 1}`,
                  },
                ]);
              }}
            >
              Add Choice
            </button>
            <button
              className="btn-outline btn-warning btn col-span-2 max-w-sm text-lg"
              onClick={() => {
                setChoices((choices) => {
                  return choices.filter((choice) => {
                    console.log(choice.index);
                    choice.index != 1;
                  });
                });
              }}
            >
              Remove Choice
            </button>

            <p className="col-span-1">Correct Answer: </p>
            <input
              type="text"
              placeholder="Type your explanation here"
              className="input-bordered input col-span-3 "
              value={answer} // ...force the input's value to match the state variable...
              onChange={(e) => {
                const userAnswer = parseInt(e.target.value);
                if (Number.isNaN(userAnswer)) {
                  toast.error("Please enter marks");
                } else if (userAnswer < 0) {
                  toast.error("Marks cannot be negative");
                } else {
                  setAnswer(userAnswer);
                }
              }} // ... and update the state variable on any edits!
            />

            <p className="col-span-1">Marks: </p>
            <input
              type="text"
              placeholder="Type your explanation here"
              className="input-bordered input col-span-3 "
              value={marks} // ...force the input's value to match the state variable...
              onChange={(e) => {
                const mark = parseInt(e.target.value);
                if (Number.isNaN(mark)) {
                  toast.error("Please enter marks");
                } else if (mark < 0) {
                  toast.error("Marks cannot be negative");
                } else {
                  setMarks(mark);
                }
              }} // ... and update the state variable on any edits!
            />

            <p className="col-span-1">Explanation: </p>
            <input
              type="text"
              placeholder="Type your explanation here"
              className="input-bordered input col-span-3 "
              value={explanation} // ...force the input's value to match the state variable...
              onChange={(e) => {
                if (e.target.value == "") {
                  toast.error("The text cannot be empty");
                } else {
                  setExplanation(e.target.value);
                }
              }} // ... and update the state variable on any edits!
            />
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
