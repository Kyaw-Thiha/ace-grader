import { useState } from "react";
import MarkdownEditor from "@components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";

type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];

interface Props {
  question: LongAnswerQuestion;
  refetch: QueryObserverBaseResult["refetch"];
}

const LongAnswerQuestion: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-6">
      <Text question={props.question} refetch={props.refetch} />
      <SampleAnswer question={props.question} refetch={props.refetch} />
      <Marks question={props.question} refetch={props.refetch} />
      <Explanation question={props.question} refetch={props.refetch} />
    </div>
  );
};

export default LongAnswerQuestion;

const Text: React.FC<Props> = (props) => {
  const [text, setText] = useState(props.question?.text ?? "");

  const editText = api.longAnswerQuestion.editText.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateText = () => {
    if (text != "") {
      editText.mutate({ id: props.question?.id ?? "", text: text });
    }
  };
  useAutosave({
    data: text,
    onSave: updateText,
  });

  return (
    <MarkdownEditor
      text={text}
      label="Question"
      onChange={(e) => setText(e.target.value)}
    />
  );
};

const SampleAnswer: React.FC<Props> = (props) => {
  const [sampleAnswer, setSampleAnswer] = useState(
    props.question?.sampleAnswer ?? ""
  );

  const editSampleAnswer = api.longAnswerQuestion.editSampleAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateSampleAnswer = () => {
    if (sampleAnswer != "") {
      editSampleAnswer.mutate({
        id: props.question?.id ?? "",
        sampleAnswer: sampleAnswer,
      });
    }
  };
  useAutosave({ data: sampleAnswer, onSave: updateSampleAnswer });

  return (
    <MarkdownEditor
      text={sampleAnswer}
      label="Sample Answer"
      onChange={(e) => setSampleAnswer(e.target.value)}
    />
  );
};

const Marks: React.FC<Props> = (props) => {
  const [marks, setMarks] = useState(props.question?.marks.toString() ?? "");

  const editMarks = api.longAnswerQuestion.editMarks.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateMarks = () => {
    if (marks != "") {
      const marksInt = parseInt(marks, 10);

      if (marksInt > 0) {
        editMarks.mutate({ id: props.question?.id ?? "", marks: marksInt });
      }
    }
  };
  useAutosave({ data: marks, onSave: updateMarks });

  return (
    <>
      <p className="text-slate-400">Marks</p>
      <input
        type="text"
        placeholder="Type here"
        className="input-bordered input transition-all"
        value={marks.toString()}
        onChange={(e) => {
          setMarks(e.target.value);
        }}
      />
    </>
  );
};

const Explanation: React.FC<Props> = (props) => {
  const [explanation, setExplanation] = useState(
    props.question?.explanation ?? ""
  );

  const editText = api.longAnswerQuestion.editExplanation.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateExplanation = () => {
    if (explanation != "") {
      editText.mutate({
        id: props.question?.id ?? "",
        explanation: explanation,
      });
    }
  };
  useAutosave({
    data: explanation,
    onSave: updateExplanation,
  });

  return (
    <MarkdownEditor
      text={explanation}
      label="Explanation"
      onChange={(e) => setExplanation(e.target.value)}
    />
  );
};
