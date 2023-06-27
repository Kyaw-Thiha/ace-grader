import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { convertIntegerToASCII, convertASCIIToInteger } from "@/utils/helper";
import { type QueryObserverBaseResult } from "@tanstack/react-query";

import { Bot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AutosizeInput } from "@/components/ui/resize-input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { openaiAPI } from "@/server/openai/api";

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
    if (text != "" && text != props.question?.text) {
      editText.mutate({ id: props.question?.id ?? "", text: text });
    }
  };
  useAutosave({
    data: text,
    onSave: updateText,
  });

  return (
    // <MarkdownEditor
    //   text={text}
    //   label="Question"
    //   onChange={(e) => setText(e.target.value)}
    // />
    <div>
      <p className="text-slate-400">Question</p>
      <AutosizeInput
        placeholder="Type here"
        className="mt-2 transition-all"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
    </div>
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
    if (
      text != "" &&
      text != props.question?.choices.at(props.index - 1)?.text
    ) {
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
    <div className="flex items-center justify-center gap-4">
      {/* <MarkdownEditor
        text={text}
        label={convertIntegerToASCII(props.index)}
        onChange={(e) => setText(e.target.value)}
      /> */}
      <p className="text-slate-400">{convertIntegerToASCII(props.index)}</p>
      <AutosizeInput
        placeholder="Type here"
        className="mt-2 transition-all"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
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
    if (
      answerText != "" &&
      answerText != convertIntegerToASCII(props.question?.answer ?? 0)
    ) {
      editAnswer.mutate({ id: props.question?.id ?? "", answer: answer });
    }
  };

  return (
    <>
      <p className="mb-2 text-slate-400">Answer</p>
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
    if (marks != "" && marks != props.question?.marks.toString()) {
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
      <Input
        type="text"
        placeholder="Type here"
        className="mt-2 w-14 transition-all"
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
  const [loading, setLoading] = useState(false);

  const editText = api.multipleChoiceQuestion.editExplanation.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateExplanation = () => {
    if (explanation != "" && explanation != props.question?.explanation) {
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

  // Fetching openai's response for generating explanations
  const fetchExplanation = async () => {
    // Fetching the explanation and updating it
    const res = await openaiAPI.multipleChoiceQuestion.generateExplanation(
      props.question
    );
    const data = res.data.choices[0]?.text ?? "";
    // Remove the first character as it is either empty space or \n
    const explanationResponse = data.slice(1);
    setExplanation(explanationResponse);
  };

  // Generating explanation from openai
  const generateExplanation = () => {
    if (props.question?.text.trim() == "") {
      toast.error("Question text cannot be blank");
    } else if (
      props.question?.choices.length == 0 ||
      props.question?.choices.at(0)?.text == ""
    ) {
      toast.error("Choices need to be added");
    } else if (props.question?.answer == 0) {
      toast.error("Answer must be chosen");
    } else if (props.question?.marks == 0) {
      toast.error("Marks must be added");
    } else {
      setLoading(true);
      void toast.promise(fetchExplanation, {
        pending: "Generating Explanation",
        success: "Explanation generated 👌",
        error: "Error in explanation generation 🤯",
      });
      setLoading(false);
    }
  };

  return (
    // <MarkdownEditor
    //   text={explanation}
    //   label="Explanation"
    //   onChange={(e) => setExplanation(e.target.value)}
    // />
    <div>
      <p className="text-slate-400">Explanation</p>
      <div className="mt-2 flex items-center justify-center gap-4">
        <AutosizeInput
          placeholder="Type here"
          className="transition-all"
          value={explanation}
          onChange={(e) => {
            setExplanation(e.target.value);
          }}
          disabled={loading}
        />
        <Button onClick={() => generateExplanation()} disabled={loading}>
          <Bot className="mr-2 h-4 w-4" /> Generate
        </Button>
      </div>
    </div>
  );
};
