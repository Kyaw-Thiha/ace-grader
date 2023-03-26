import { useState } from "react";
import MarkdownEditor from "@components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";

type ShortAnswerQuestion = RouterOutputs["shortAnswerQuestion"]["get"];

interface Props {
  question: ShortAnswerQuestion;
  refetch: QueryObserverBaseResult["refetch"];
}

const ShortAnswerQuestion: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-6">
      <Text question={props.question} refetch={props.refetch} />
      <Answer question={props.question} refetch={props.refetch} />
      <Marks question={props.question} refetch={props.refetch} />
      <Explanation question={props.question} refetch={props.refetch} />
    </div>
  );
};

export default ShortAnswerQuestion;

const Text: React.FC<Props> = (props) => {
  const [text, setText] = useState(props.question?.text ?? "");

  const editText = api.shortAnswerQuestion.editText.useMutation({
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

const Answer: React.FC<Props> = (props) => {
  const [answer, setAnswer] = useState(props.question?.answer ?? "");

  const editAnswer = api.shortAnswerQuestion.editAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateAnswer = () => {
    if (answer != "") {
      editAnswer.mutate({ id: props.question?.id ?? "", answer: answer });
    }
  };
  useAutosave({ data: answer, onSave: updateAnswer });

  return (
    <MarkdownEditor
      text={answer}
      label="Answer"
      onChange={(e) => setAnswer(e.target.value)}
    />
  );
};

const Marks: React.FC<Props> = (props) => {
  const [marks, setMarks] = useState(props.question?.marks.toString() ?? "");

  const editMarks = api.shortAnswerQuestion.editMarks.useMutation({
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
        className="input-bordered input w-14 bg-gray-700 text-white transition-all"
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

  const editText = api.shortAnswerQuestion.editExplanation.useMutation({
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
