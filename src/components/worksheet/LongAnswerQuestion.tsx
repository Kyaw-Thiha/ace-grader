import { useState } from "react";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { openaiAPI } from "@/server/openai/api";
import { Bot, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AutosizeInput } from "@/components/ui/resize-input";

type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];

interface Props {
  question: LongAnswerQuestion;
  refetch: QueryObserverBaseResult["refetch"];
}

const LongAnswerQuestion: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-6 px-12">
      <Text question={props.question} refetch={props.refetch} />
      <Marks question={props.question} refetch={props.refetch} />
      <MarkingScheme question={props.question} refetch={props.refetch} />
      <Explanation question={props.question} refetch={props.refetch} />
      {/* <SampleAnswer question={props.question} refetch={props.refetch} /> */}
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

const Marks: React.FC<Props> = (props) => {
  const [marks, setMarks] = useState(props.question?.marks.toString() ?? "");

  const editMarks = api.longAnswerQuestion.editMarks.useMutation({
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
    <div>
      <p className="text-slate-400">Marks</p>
      <Input
        placeholder="Type here"
        className="mt-2 w-16 transition-all"
        value={marks.toString()}
        onChange={(e) => {
          setMarks(e.target.value);
        }}
      />
    </div>
  );
};

const MarkingScheme: React.FC<Props> = (props) => {
  const markingScheme = props.question?.markingScheme as string[];

  return (
    <div>
      <p className="text-slate-400">Marking Scheme</p>
      <div className="mt-2 flex flex-col gap-2">
        {markingScheme.map((marking, index) => {
          return <p key={index}>{marking}</p>;
        })}
      </div>
      <div className="mt-4">
        <MarkingSchemeForm question={props.question} refetch={props.refetch} />
      </div>
    </div>
  );
};

const MarkingSchemeForm: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [markingScheme, setMarkingScheme] = useState(
    props.question?.markingScheme as string[]
  );

  const editMarkingScheme =
    api.longAnswerQuestion.editMarkingScheme.useMutation({
      onSuccess: () => {
        void props.refetch();
      },
    });
  const updateMarkingScheme = () => {
    // Removing empty markings
    const markingSchemeCopy = markingScheme.filter(
      (str: string) => str.trim() !== ""
    );
    setMarkingScheme(markingSchemeCopy);

    if (markingScheme.length != 0) {
      setOpen(false);

      void toast.promise(
        editMarkingScheme.mutateAsync({
          id: props.question?.id ?? "",
          markingScheme: markingScheme,
        }),
        {
          pending: "Editing Marking Scheme",
          success: "Successful Editing 👌",
          error: "Error in Editing 🤯",
        }
      );
    } else {
      toast.error("Marking scheme need to be defined.");
    }
  };

  const handleOnChange = (index: number, text: string) => {
    const markingSchemeCopy = [...markingScheme];
    markingSchemeCopy[index] = text;
    setMarkingScheme(markingSchemeCopy);
  };

  const addMarking = () => {
    const markingSchemeCopy = [...markingScheme];
    markingSchemeCopy.push("");
    setMarkingScheme(markingSchemeCopy);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{markingScheme.length == 0 ? "Add" : "Edit"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Marking Scheme</DialogTitle>
          <DialogDescription>
            <p className="mt-2 text-accent-foreground">
              Create at least one marking point per mark. Click <b>Add</b> to
              add a marking point.
            </p>
            <div className="mt-4 flex flex-col gap-4">
              {markingScheme?.map((marking, index) => {
                return (
                  <Input
                    key={index}
                    value={marking}
                    className="text-black dark:text-white"
                    onChange={(e) => handleOnChange(index, e.target.value)}
                  />
                );
              })}
            </div>
            <Button className="mt-4" onClick={addMarking}>
              Add
            </Button>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => updateMarkingScheme()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Explanation: React.FC<Props> = (props) => {
  const [explanation, setExplanation] = useState(
    props.question?.explanation ?? ""
  );
  const [loading, setLoading] = useState(false);

  const editExplanation = api.longAnswerQuestion.editExplanation.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateExplanation = () => {
    if (explanation != "" && explanation != props.question?.explanation) {
      editExplanation.mutate({
        id: props.question?.id ?? "",
        explanation: explanation,
      });
    }
  };
  useAutosave({
    data: explanation,
    onSave: updateExplanation,
  });

  const { refetch: refetchRateLimit } =
    api.longAnswerQuestion.checkAIRateLimit.useQuery(undefined, {
      enabled: false,
    });
  const fetchExplanation = async () => {
    const ratelimitResponse = await refetchRateLimit();
    if (ratelimitResponse.data) {
      // Fetching the explanation and updating it
      const res = await openaiAPI.longAnswerQuestion.generateExplanation(
        props.question
      );
      const data = res.data.choices[0]?.text ?? "";
      // Remove the first character as it is either empty space or \n
      const explanationResponse = data.slice(1);
      setExplanation(explanationResponse);
    } else {
      return Promise.reject();
    }
  };

  // Fetching openai's response for generating explanations
  const generateExplanation = () => {
    const markingScheme = props.question?.markingScheme as string[];

    if (props.question?.text.trim() == "") {
      toast.error("Question text cannot be blank");
    } else if (markingScheme.length == 0 || markingScheme.at(0) == "") {
      toast.error("Marking Scheme needs to be added");
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() => void generateExplanation()}
                disabled={loading}
              >
                <Bot className="mr-2 h-4 w-4" /> Generate
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Let AI do its <Sparkles className="inline-block h-4 w-4" />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

const SampleAnswer: React.FC<Props> = (props) => {
  const [sampleAnswer, setSampleAnswer] = useState(
    props.question?.sampleAnswer ?? ""
  );
  const [loading, setLoading] = useState(false);

  const editSampleAnswer = api.longAnswerQuestion.editSampleAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateSampleAnswer = () => {
    if (sampleAnswer != "" && sampleAnswer != props.question?.sampleAnswer) {
      editSampleAnswer.mutate({
        id: props.question?.id ?? "",
        sampleAnswer: sampleAnswer,
      });
    }
  };
  useAutosave({ data: sampleAnswer, onSave: updateSampleAnswer });

  // Fetching openai's response for generating sample answer
  const fetchSampleAnswer = async () => {
    // Fetching the explanation and updating it
    const res = await openaiAPI.longAnswerQuestion.generateSampleAnswer(
      props.question
    );
    const data = res.data.choices[0]?.text ?? "";
    // Remove the first character as it is either empty space or \n
    const sampleAnswerResponse = data.slice(1);
    setSampleAnswer(sampleAnswerResponse);
  };

  // Generating explanation from openai
  const generateSampleAnswer = () => {
    const markingScheme = props.question?.markingScheme as string[];

    if (props.question?.text.trim() == "") {
      toast.error("Question text cannot be blank");
    } else if (markingScheme.length == 0 || markingScheme.at(0) == "") {
      toast.error("Marking Scheme needs to be added");
    } else if (props.question?.marks == 0) {
      toast.error("Marks must be added");
    } else {
      setLoading(true);
      void toast.promise(fetchSampleAnswer, {
        pending: "Generating Sample Answer",
        success: "Sample answer generated 👌",
        error: "Error in sample answer generation 🤯",
      });
      setLoading(false);
    }
  };

  return (
    // <MarkdownEditor
    //   text={sampleAnswer}
    //   label="Sample Answer"
    //   onChange={(e) => setSampleAnswer(e.target.value)}
    // />
    <div>
      <p className="text-slate-400">Sample Answer</p>

      <div className="mt-2 flex items-center justify-center gap-4">
        <AutosizeInput
          placeholder="Type here"
          className="transition-all"
          value={sampleAnswer}
          onChange={(e) => {
            setSampleAnswer(e.target.value);
          }}
          disabled={loading}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() => void generateSampleAnswer()}
                disabled={loading}
              >
                <Bot className="mr-2 h-4 w-4" /> Generate
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Let AI do its <Sparkles className="inline-block h-4 w-4" />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
