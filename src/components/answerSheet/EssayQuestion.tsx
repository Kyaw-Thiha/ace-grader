import { useState } from "react";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import type { AnswerSheetStatus } from "@/utils/interface";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
// import MarkdownText from "@/components/MarkdownText";

import { AutosizeInput } from "@/components/ui/resize-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

type EssayQuestion = RouterOutputs["essayQuestion"]["get"];
type EssayAnswer = RouterOutputs["essayAnswer"]["get"];

interface Props {
  question: EssayQuestion;
  answer?: EssayAnswer;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
}

const EssayQuestion: React.FC<Props> = (props) => {
  const hasAnswered =
    props.status == "sample-teacherview" ||
    props.status == "checking-teacherview" ||
    props.status == "returned-teacherview" ||
    props.status == "returned-studentview";

  const getMarks = (name: string) => {
    return props.question?.criteria.find((x) => x.name == name)?.marks ?? 0;
  };
  const marks =
    getMarks("Grammar") +
    getMarks("Focus") +
    getMarks("Exposition") +
    getMarks("Organization") +
    getMarks("Sentence Structure") +
    getMarks("Plot") +
    getMarks("Narrative Techniques") +
    getMarks("Descriptive Techniques") +
    getMarks("Literary Devices") +
    getMarks("Language and Vocabulary") +
    getMarks("Content") +
    getMarks("Persuasion") +
    getMarks("Purpose") +
    getMarks("Register");

  return (
    <div className="flex flex-col">
      <CardHeader>
        <CardTitle className="whitespace-pre-line text-lg font-normal leading-relaxed">
          <Latex
            delimiters={[
              { left: "$$", right: "$$", display: true },
              { left: "\\(", right: "\\)", display: false },
              { left: "$", right: "$", display: false },
              { left: "\\[", right: "\\]", display: false },
            ]}
          >
            {props.question?.text}
          </Latex>
        </CardTitle>
        <CardDescription>
          <div className="mt-2">
            {props.status.startsWith("returned-") ? (
              <span
                className={`rounded-md border-2 px-2 py-1 ${
                  props.answer?.marks ?? 0 >= marks * 0.7
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                Marks: {props.answer?.marks} / {marks}
              </span>
            ) : (
              <span className="rounded-md border-2 px-2 py-1">
                Marks: {marks}
              </span>
            )}
          </div>
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
              <StudentAnswer
                question={props.question}
                answer={props.answer}
                refetch={props.refetch}
                status={props.status}
              />
            </div>
          </div>
        </form>
      </CardContent>

      {hasAnswered && (
        <CardFooter className="mt-8 flex flex-col gap-4">
          {props.answer?.criteria.map((criterion) => {
            return (
              <Criteria
                key={criterion.id}
                name={criterion.name}
                marks={criterion.marks}
                totalMarks={getMarks(criterion.name)}
                evaluation={criterion.evaluation}
                suggestion={criterion.suggestion}
              />
            );
          })}
          <div className="mt-8 flex w-full flex-col rounded-md border p-4">
            {props.answer?.properties.map((property) => {
              return (
                <div className="flex-1 space-y-1" key={property.id}>
                  <p className="font-medium leading-none">{property.name}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {property.text}
                  </p>
                </div>
              );
            })}
          </div>
        </CardFooter>
      )}
    </div>
  );
};

export default EssayQuestion;

const StudentAnswer: React.FC<Props> = (props) => {
  const [answer, setAnswer] = useState(props.answer?.studentAnswer ?? "");

  const editAnswer = api.essayAnswer.editAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateAnswer = () => {
    if (answer != "" && props.status == "answering-studentview") {
      editAnswer.mutate({
        id: props.answer?.id ?? "",
        studentAnswer: answer,
      });
    }
  };
  useAutosave({ data: answer, onSave: updateAnswer });

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <AutosizeInput
        minRows={20}
        placeholder="Type here"
        className="text-md transition-all disabled:cursor-default disabled:opacity-100"
        disabled={props.status != "answering-studentview"}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <span className="rounded-md border-2 px-2 py-1">
        Word Count: {answer.split(" ").length}
      </span>
    </div>
  );
};

interface CriteriaProps {
  name: string;
  marks: number;
  totalMarks: number;
  evaluation: string;
  suggestion: string;
}
export const Criteria: React.FC<CriteriaProps> = (props) => {
  return (
    <div className="flex w-full flex-col rounded-md border p-4">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{props.name}</p>
        <p className="text-sm text-muted-foreground">{props.evaluation}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Suggestion: {props.suggestion}
        </p>
      </div>
      <div className="mt-4">
        <span
          className={` rounded-md border-2 px-2 py-1 text-sm ${
            props.marks >= props.totalMarks * 0.7
              ? "bg-green-100"
              : props.marks >= props.totalMarks * 0.5
              ? "bg-yellow-100"
              : "bg-red-100"
          }`}
        >
          Marks: {props.marks} / {props.totalMarks}
        </span>
      </div>
    </div>
  );
};
