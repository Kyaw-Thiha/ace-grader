import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import Explanation from "./Explanation";
import type { AnswerSheetStatus } from "@/utils/interface";
import MarkdownText from "@/components/MarkdownText";
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

type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];
type LongAnswerQuestionAnswer =
  RouterOutputs["longAnswerQuestionAnswer"]["get"];

interface Props {
  question: LongAnswerQuestion;
  answer?: LongAnswerQuestionAnswer;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
}

const LongAnswerQuestion: React.FC<Props> = (props) => {
  const hasAnswered =
    props.status == "sample-teacherview" ||
    props.status == "checking-teacherview" ||
    props.status == "returned-teacherview" ||
    props.status == "returned-studentview";

  return (
    <div className="flex flex-col">
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
        <div className="mt-4 rounded-md border-2 px-4 py-2">
          Feedback: {props.answer?.feedback}
        </div>
      </CardContent>

      {hasAnswered ? (
        <CardFooter className="mt-8 flex flex-col gap-4">
          <Explanation question={props.question} status={props.status} />
          <SampleAnswer
            question={props.question}
            answer={props.answer}
            status={props.status}
          />
        </CardFooter>
      ) : (
        <></>
      )}
    </div>
  );
};

export default LongAnswerQuestion;

const StudentAnswer: React.FC<Props> = (props) => {
  const [answer, setAnswer] = useState(props.answer?.studentAnswer ?? "");

  const editAnswer = api.longAnswerQuestionAnswer.editAnswer.useMutation({
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
    // <MarkdownEditor
    //   text={answer}
    //   label="Answer"
    //   disabled={props.status != "answering-studentview"}
    //   outlined
    //   onChange={(e) => setAnswer(e.target.value)}
    // />
    <AutosizeInput
      minRows={4}
      placeholder="Type here"
      className="transition-all disabled:cursor-default disabled:opacity-100"
      disabled={props.status != "answering-studentview"}
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
    />
  );
};
