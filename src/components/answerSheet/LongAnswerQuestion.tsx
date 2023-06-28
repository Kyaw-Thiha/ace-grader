import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import Explanation from "./Explanation";
import type { AnswerSheetStatus } from "@/utils/interface";
import MarkdownText from "@/components/MarkdownText";
import SampleAnswer from "./SampleAnswer";
import { AutosizeInput } from "../ui/resize-input";

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
      <div className="">
        <Explanation question={props.question} status={props.status} />
        <SampleAnswer
          question={props.question}
          answer={props.answer}
          status={props.status}
        />
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
      className="transition-all"
      disabled={props.status != "answering-studentview"}
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
    />
  );
};
