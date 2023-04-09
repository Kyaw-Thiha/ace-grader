import { useState } from "react";
import { api, type RouterOutputs } from "@utils/api";
import { convertIntegerToASCII } from "@utils/helper";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import MarkdownText from "@components/MarkdownText";
import { type AnswerSheetStatus } from "@utils/interface";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];

interface Props {
  question: MultipleChoiceQuestion;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
}

const MultipleChoiceQuestion: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="mt-3">
        <MarkdownText text={props.question?.text ?? ""} />
        <p className="mt-2">Marks: {props.question?.marks}</p>
      </div>
      <ChoiceGroup
        question={props.question}
        refetch={props.refetch}
        status={props.status}
      />

      <Explanation
        question={props.question}
        refetch={props.refetch}
        status={props.status}
      />
    </div>
  );
};

export default MultipleChoiceQuestion;

const ChoiceGroup: React.FC<Props> = (props) => {
  const [chosenChoice, setChosenChoice] = useState(props.question?.answer);

  // const editText = api.multipleChoiceQuestion.editChoice.useMutation({
  //   onSuccess: () => {
  //     void props.refetch();
  //   },
  // });
  // const updateText = () => {
  //   editText.mutate({
  //     multipleChoiceQuestionOptionId:
  //       props.question?.choices.at(props.index - 1)?.id ?? "",
  //     text: text,
  //     index: props.index,
  //   });
  // };

  const updateChoice = (index: number) => {
    if (props.status == "answering-studentview") {
      setChosenChoice(index);
    }
  };

  const getRadioClass = (index: number) => {
    let className = "radio";
    if (props.status == "sample-teacherview") {
      // For the sample answer, automatically select the corrent choice
      if (index == props.question?.answer) {
        className = className + " radio-success";
      }
    } else if (
      props.status == "checking-teacherview" ||
      props.status == "returned-studentview" ||
      props.status == "returned-teacherview"
    ) {
      if (index == props.question?.answer) {
        className = className + " radio-success";
      } else {
      }
    }

    return className;
  };

  return (
    <div className="flex flex-col">
      {props.question?.choices.map((choice) => (
        <div key={choice.index} className="my-2">
          <label className=" flex cursor-pointer flex-row gap-2">
            <input
              type="radio"
              name={`multiple-choice-question-${props.question?.id ?? ""}`}
              className={getRadioClass(choice.index)}
              checked={chosenChoice == choice.index}
              onChange={() => updateChoice(choice.index)}
            />
            <div className="flex flex-row gap-2 ">
              <p className="text-xl">{convertIntegerToASCII(choice.index)})</p>
              <p className="text-lg">{choice.text}</p>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

const Explanation: React.FC<Props> = (props) => {
  let showExplanation = false;

  if (props.status == "sample-teacherview") {
    // Show the explanation if it is the sample answer
    if (props.question?.explanation?.trim() != "") {
      showExplanation = true;
    }
  } else if (
    props.status == "checking-teacherview" ||
    props.status == "returned-studentview" ||
    props.status == "returned-teacherview"
  ) {
    // Show explanation if teacher is checking or the answer sheet has been returned
    if (props.question?.explanation?.trim() != "") {
      showExplanation = true;
    }
  } else {
    showExplanation = false;
  }

  if (showExplanation) {
    return (
      <div className="collapse-arrow collapse border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium text-slate-800">
          Explanation
        </div>
        <div className="collapse-content">
          <p>{props.question?.explanation}</p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
