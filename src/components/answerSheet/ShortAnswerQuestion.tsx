import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import MarkdownText from "@/components/MarkdownText";
import { type AnswerSheetStatus } from "@/utils/interface";
import Explanation from "./Explanation";

type ShortAnswerQuestion = RouterOutputs["shortAnswerQuestion"]["get"];
type ShortAnswerQuestionAnswer =
  RouterOutputs["shortAnswerQuestionAnswer"]["get"];

interface Props {
  question: ShortAnswerQuestion;
  answer?: ShortAnswerQuestionAnswer;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
}

const ShortAnswerQuestion: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="mt-3">
        <MarkdownText text={props.question?.text ?? ""} />
        <p className="mt-6 ">
          <span className="rounded-md border-2 border-slate-800 px-2 py-1">
            Marks: {props.question?.marks}
          </span>
        </p>
      </div>
      <StudentAnswer
        question={props.question}
        answer={props.answer}
        refetch={props.refetch}
        status={props.status}
      />
      <CorrectAnswer
        question={props.question}
        answer={props.answer}
        refetch={props.refetch}
        status={props.status}
      />
      <div className="mt-8">
        <Explanation question={props.question} status={props.status} />
      </div>
    </div>
  );
};

export default ShortAnswerQuestion;

const StudentAnswer: React.FC<Props> = (props) => {
  const [answer, setAnswer] = useState(props.answer?.studentAnswer ?? "");

  const editAnswer = api.shortAnswerQuestionAnswer.editAnswer.useMutation({
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
    <MarkdownEditor
      text={answer}
      label="Answer"
      outlined
      disabled={props.status != "answering-studentview"}
      onChange={(e) => setAnswer(e.target.value)}
    />
  );
};

const CorrectAnswer: React.FC<Props> = (props) => {
  let showCorrectAnswer = false;

  if (props.status == "sample-teacherview") {
    // Show the explanation if it is the sample answer
    if (props.question?.explanation?.trim() != "") {
      showCorrectAnswer = true;
    }
  } else if (
    props.status == "checking-teacherview" ||
    props.status == "returned-studentview" ||
    props.status == "returned-teacherview"
  ) {
    // Show explanation if teacher is checking or the answer sheet has been returned
    showCorrectAnswer = true;
  } else {
    showCorrectAnswer = false;
  }

  if (showCorrectAnswer) {
    return (
      <div className="mt-8">
        <div className="inline-block min-w-[80vw] rounded-lg border-2 border-slate-400 px-4 py-1">
          <div className=" text-md text-slate-400">Correct Answer</div>
          <MarkdownText text={props.question?.answer ?? ""} />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
