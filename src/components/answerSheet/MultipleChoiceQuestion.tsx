import { useState } from "react";
import { api, type RouterOutputs } from "@/utils/api";
import { convertIntegerToASCII } from "@/utils/helper";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import MarkdownText from "@/components/MarkdownText";
import { type AnswerSheetStatus } from "@/utils/interface";
import Explanation from "./Explanation";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
type MultipleChoiceQuestionAnswer =
  RouterOutputs["multipleChoiceQuestionAnswer"]["get"];

interface Props {
  question: MultipleChoiceQuestion;
  answer?: MultipleChoiceQuestionAnswer;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
}

const MultipleChoiceQuestion: React.FC<Props> = (props) => {
  const hasAnswered =
    props.status == "sample-teacherview" ||
    props.status == "checking-teacherview" ||
    props.status == "returned-teacherview" ||
    props.status == "returned-studentview";

  return (
    <div className="flex w-full flex-col">
      <CardHeader>
        <CardTitle>
          <MarkdownText text={props.question?.text ?? ""} />
        </CardTitle>
        <CardDescription>
          {props.status.startsWith("returned-") ? (
            <span
              className={`rounded-md border-2 px-2 py-1 ${
                props.answer?.marks == props.question?.marks
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              Marks: {props.answer?.marks} / {props.question?.marks}
            </span>
          ) : (
            <span className="rounded-md border-2 px-2 py-1">
              Marks: {props.question?.marks}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="my-4 flex w-full flex-col items-center justify-center gap-2">
          {props.question?.images.map((image) => {
            return (
              <div key={image.id}>
                <Image
                  src={image.url}
                  alt={image.caption}
                  width="300"
                  height="300"
                />
              </div>
            );
          })}
        </div>

        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <ChoiceGroup
                question={props.question}
                answer={props.answer}
                refetch={props.refetch}
                status={props.status}
              />
            </div>
          </div>
        </form>
      </CardContent>

      {hasAnswered ? (
        <CardFooter className="mt-8">
          <Explanation question={props.question} status={props.status} />
        </CardFooter>
      ) : (
        <></>
      )}
      {/* {hasAnswered ?? (
        <CardFooter className="mt-8">
          <Explanation question={props.question} status={props.status} />
        </CardFooter>
      )} */}
    </div>
  );
};

export default MultipleChoiceQuestion;

const ChoiceGroup: React.FC<Props> = (props) => {
  const [chosenChoice, setChosenChoice] = useState(
    props.status == "sample-teacherview"
      ? props.question?.answer
      : props.answer?.studentAnswer
  );

  const editAnswer = api.multipleChoiceQuestionAnswer.editAnswer.useMutation({
    onSuccess: () => {
      //void props.refetch();
    },
  });

  const updateChoice = (index: number) => {
    if (props.status == "answering-studentview") {
      editAnswer.mutate({
        id: props.answer?.id ?? "",
        studentAnswer: index,
      });
      setChosenChoice(index);
    }
  };

  // /**
  //  * Function to handle each change in radio value
  //  *
  //  * value format - {question id}_{choice index}
  //  */
  // const handleValueChange = (value: string) => {
  //   const word = "_";
  //   const lastIndex = value.lastIndexOf(word);
  //   const substring = value.substring(lastIndex + word.length);

  //   updateChoice(parseInt(substring));
  // };

  /**
   * Function to determine the class names of each radio button.
   *
   * Will be looped for each radio button.
   *
   * @param index of current choice
   */

  const getRadioClass = (index: number) => {
    let className = "disabled:opacity-100";
    if (props.status == "sample-teacherview") {
      // For the sample answer, automatically select the corrent choice
      if (index == props.question?.answer) {
        className = className + " border-green-400 text-green-600";
      }
    } else if (
      props.status == "checking-teacherview" ||
      props.status == "returned-studentview" ||
      props.status == "returned-teacherview"
    ) {
      if (index == props.question?.answer) {
        console.log("index - ", index);
        console.log("answer - ", props.question.answer);
        // For the correct answer, highlight the radio button as positive color
        className = className + " border-green-400 text-green-600";
      } else if (
        index != props.question?.answer &&
        index == props.answer?.studentAnswer
      ) {
        // If student chose the wrong answer, make the radio button have error color
        className = className + " border-red-400 text-red-500";
      }
    }

    return className;
  };

  return (
    <>
      <RadioGroup
        defaultValue={`${props.question?.id ?? ""}_${
          chosenChoice?.toString() ?? ""
        }`}
        disabled={props.status != "answering-studentview"}
      >
        {props.question?.choices.map((choice) => (
          <div key={choice.index} className="flex items-center space-x-2">
            <RadioGroupItem
              className={getRadioClass(choice.index)}
              value={`${props.question?.id ?? ""}_${choice.index?.toString()}`}
              id={`${props.question?.id ?? ""}_${choice.index?.toString()}`}
              onClick={() => updateChoice(choice.index)}
            />
            <Label
              htmlFor={`${
                props.question?.id ?? ""
              }_${choice.index?.toString()}`}
            >
              <div className="flex flex-row gap-2 font-normal">
                <p className="text-xl">
                  {convertIntegerToASCII(choice.index)})
                </p>
                <p className="text-lg">{choice.text}</p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};
