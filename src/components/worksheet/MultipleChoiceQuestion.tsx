import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { convertIntegerToASCII, convertASCIIToInteger } from "@/utils/helper";
import { type QueryObserverBaseResult } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];

interface Props {
  question: MultipleChoiceQuestion;
  refetch: QueryObserverBaseResult["refetch"];
}

const MultipleChoiceQuestion: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-6">
      <Text question={props.question} refetch={props.refetch} />
      <div className="flex flex-col">
        {props.question?.choices.map((choice) => (
          <div key={choice.index} className="my-2">
            <Choice
              question={props.question}
              refetch={props.refetch}
              index={choice.index}
            />
          </div>
        ))}
      </div>
      <div>
        <Answer question={props.question} refetch={props.refetch} />
      </div>
      <div>
        <Marks question={props.question} refetch={props.refetch} />
      </div>
      <div>
        <Explanation question={props.question} refetch={props.refetch} />
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;

const Text: React.FC<Props> = (props) => {
  const [text, setText] = useState(props.question?.text ?? "");

  const editText = api.multipleChoiceQuestion.editText.useMutation({
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

interface ChoiceProps extends Props {
  index: number;
}
const Choice: React.FC<ChoiceProps> = (props) => {
  const [text, setText] = useState(
    props.question?.choices.at(props.index - 1)?.text ?? ""
  );

  const editText = api.multipleChoiceQuestion.editChoice.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateText = () => {
    if (text != "") {
      editText.mutate({
        multipleChoiceQuestionOptionId:
          props.question?.choices.at(props.index - 1)?.id ?? "",
        text: text,
        index: props.index,
      });
    }
  };
  useAutosave({ data: text, onSave: updateText });

  return (
    <div className="flex">
      <MarkdownEditor
        text={text}
        label={convertIntegerToASCII(props.index)}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

const Answer: React.FC<Props> = (props) => {
  const [answer, setAnswer] = useState(
    convertIntegerToASCII(props.question?.answer ?? 0)
  );

  const editAnswer = api.multipleChoiceQuestion.editAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateAnswer = (answer: number) => {
    const answerText = convertIntegerToASCII(answer);
    setAnswer(answerText);
    if (answerText != "") {
      editAnswer.mutate({ id: props.question?.id ?? "", answer: answer });
    }
  };

  return (
    <>
      <p className="text-slate-400">Answer</p>
      <Select
        defaultValue={answer}
        onValueChange={(val) => updateAnswer(convertASCIIToInteger(val))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={answer} />
        </SelectTrigger>
        <SelectContent>
          {props.question?.choices.map((choice) => (
            <SelectItem
              value={convertIntegerToASCII(choice.index)}
              key={choice.index}
              // onClick={() => updateAnswer(choice.index)}
            >
              {convertIntegerToASCII(choice.index)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

const Marks: React.FC<Props> = (props) => {
  const [marks, setMarks] = useState(props.question?.marks.toString() ?? "");

  const editMarks = api.multipleChoiceQuestion.editMarks.useMutation({
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

  const editText = api.multipleChoiceQuestion.editExplanation.useMutation({
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
