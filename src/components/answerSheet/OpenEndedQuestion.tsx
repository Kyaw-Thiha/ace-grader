import { useState } from "react";
import MarkdownEditor from "@/archive/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import Explanation from "@/components/answerSheet/Explanation";
import type { AnswerSheetStatus } from "@/utils/interface";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
// import MarkdownText from "@/components/MarkdownText";
import SampleAnswer from "./SampleAnswer";

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
import { MathInputDialog } from "../MathInputDialog";

type OpenEndedQuestion = RouterOutputs["openEndedQuestion"]["get"];
type OpenEndedQuestionAnswer = RouterOutputs["openEndedQuestionAnswer"]["get"];

interface Props {
  question: OpenEndedQuestion;
  answer?: OpenEndedQuestionAnswer;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
}

const OpenEndedQuestion: React.FC<Props> = (props) => {
  const hasAnswered =
    props.status == "sample-teacherview" ||
    props.status == "checking-teacherview" ||
    props.status == "returned-teacherview" ||
    props.status == "returned-studentview";

  return (
    <div className="flex flex-col">
      <CardHeader>
        <CardTitle className="whitespace-pre-line font-normal leading-relaxed">
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

        {hasAnswered && (
          <div className="mt-4 rounded-md border-2 px-4 py-2">
            Feedback: {props.answer?.feedback}
          </div>
        )}
      </CardContent>

      {hasAnswered ? (
        <CardFooter className="mt-8 flex flex-col gap-4">
          <Explanation question={props.question} status={props.status} />
          {/* <SampleAnswer
            question={props.question}
            answer={props.answer}
            status={props.status}
          /> */}
        </CardFooter>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OpenEndedQuestion;

const StudentAnswer: React.FC<Props> = (props) => {
  const [answer, setAnswer] = useState(props.answer?.studentAnswer ?? "");

  const editAnswer = api.openEndedQuestionAnswer.editAnswer.useMutation({
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

  const handleMathSave = (text: string) => {
    setAnswer(answer + text);
    updateAnswer();
  };

  return (
    // <MarkdownEditor
    //   text={answer}
    //   label="Answer"
    //   disabled={props.status != "answering-studentview"}
    //   outlined
    //   onChange={(e) => setAnswer(e.target.value)}
    // />

    <div className="flex items-center justify-center gap-4">
      <AutosizeInput
        minRows={4}
        placeholder="Type here"
        className="text-md transition-all disabled:cursor-default disabled:opacity-100"
        disabled={props.status != "answering-studentview"}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <MathInputDialog onSave={handleMathSave} />
    </div>
  );
};
