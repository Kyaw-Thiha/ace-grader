import { useState } from "react";
import MarkdownEditor from "@components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import Explanation from "./Explanation";
import { AnswerSheetStatus } from "@utils/interface";
import MarkdownText from "@components/MarkdownText";

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
      <div className="mt-8">
        <SampleAnswer
          question={props.question}
          answer={props.answer}
          refetch={props.refetch}
          status={props.status}
        />
        <Explanation question={props.question} status={props.status} />
      </div>
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
    <MarkdownEditor
      text={answer}
      label="Answer"
      disabled={props.status != "answering-studentview"}
      outlined
      onChange={(e) => setAnswer(e.target.value)}
    />
  );
};

const SampleAnswer: React.FC<Props> = (props) => {
  let showSampleAnswer = false;

  if (props.status == "sample-teacherview") {
    // Show the explanation if it is the sample answer
    if (props.question?.sampleAnswer?.trim() != "") {
      showSampleAnswer = true;
    }
  } else if (
    props.status == "checking-teacherview" ||
    props.status == "returned-studentview" ||
    props.status == "returned-teacherview"
  ) {
    // Show explanation if teacher is checking or the answer sheet has been returned
    if (props.question?.sampleAnswer?.trim() != "") {
      showSampleAnswer = true;
    }
  } else {
    showSampleAnswer = false;
  }

  if (showSampleAnswer) {
    return (
      <div className="collapse-arrow collapse border border-base-300 bg-base-100 transition-all">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium text-slate-800">
          Sample Answer
        </div>
        <div className="collapse-content">
          <MarkdownText text={props.question?.sampleAnswer ?? ""} />
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};
