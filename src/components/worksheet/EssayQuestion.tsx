import { useState } from "react";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { AutosizeInput } from "@/components/ui/resize-input";
import Images from "@/components/worksheet/Images";
import { Switch } from "@/components/ui/switch";
import type { EssayCriteriaName } from "@/components/worksheet/types";

type EssayQuestion = RouterOutputs["essayQuestion"]["get"];

interface Props {
  question: EssayQuestion;
  refetch: QueryObserverBaseResult["refetch"];
}

const EssayQuestion: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col gap-6 px-12">
      <Text question={props.question} refetch={props.refetch} />
      <Images
        question={props.question}
        questionType="OpenEndedQuestion"
        refetch={props.refetch}
      />
      <Marks question={props.question} refetch={props.refetch} />
      <CriteriaGroup question={props.question} refetch={props.refetch} />
    </div>
  );
};

export default EssayQuestion;

const Text: React.FC<Props> = (props) => {
  const [text, setText] = useState(props.question?.text ?? "");

  const editText = api.openEndedQuestion.editText.useMutation({
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
    <div>
      <p className="text-slate-400">Question</p>
      <div className="flex items-center justify-center gap-4">
        <AutosizeInput
          placeholder="Type here"
          className="mt-2 transition-all"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const Marks: React.FC<Props> = (props) => {
  const getMarks = (name: string) => {
    return props.question?.criteria.find((x) => x.name == name)?.marks ?? 0;
  };
  const marks =
    getMarks("Grammar") +
    getMarks("Focus") +
    getMarks("Exposition") +
    getMarks("Organization") +
    getMarks("Plot") +
    getMarks("Narrative Techniques") +
    getMarks("Language and Vocabulary") +
    getMarks("Content");

  return (
    <div>
      <span className="rounded-md border-2 px-2 py-1">Marks: {marks}</span>
    </div>
  );
};

const CriteriaGroup: React.FC<Props> = (props) => {
  const criteria = [
    {
      name: "Grammar",
      description:
        "Evaluate the essay's grammatical accuracy, sentence structure, and proper use of punctuation and spelling.",
    },
    {
      name: "Focus",
      description:
        "Assess whether the essay maintains a clear and consistent focus on the chosen topic or subject matter. Consider whether the essay stays on point throughout.",
    },
    {
      name: "Exposition",
      description:
        "Evaluate the effectiveness of the introduction in capturing the reader's attention and providing necessary context for the essay's content.",
    },
    {
      name: "Organization",
      description:
        "Assess the logical flow and organization of ideas within the essay. Consider the coherence of paragraphs and transitions between different sections.",
    },
    {
      name: "Plot",
      description:
        "If applicable, evaluate the development and coherence of the essay's plot or storyline. Consider its relevance to the overall theme and how well it engages the reader.",
    },
    {
      name: "Narrative Techniques",
      description:
        "Analyze the essay's use of narrative techniques, such as imagery, dialogue, and descriptive language, to enhance the storytelling and reader's experience.",
    },
    {
      name: "Language and Vocabulary",
      description:
        "Evaluate the richness and appropriateness of the language used. Consider the diversity of vocabulary and its contribution to the overall quality of the essay.",
    },

    {
      name: "Content",
      description:
        "Assess the depth and accuracy of the essay's content in relation to the chosen topic. Consider whether the essay demonstrates a comprehensive understanding of the subject matter.",
    },
  ];

  const getMarks = (name: string) => {
    return props.question?.criteria.find((x) => x.name == name)?.marks ?? 0;
  };
  const marks =
    getMarks("Grammar") +
    getMarks("Focus") +
    getMarks("Exposition") +
    getMarks("Organization") +
    getMarks("Plot") +
    getMarks("Narrative Techniques") +
    getMarks("Language and Vocabulary") +
    getMarks("Content");

  return (
    <div className="flex flex-col gap-4">
      {criteria.map((criterion, index) => {
        return (
          <Criteria
            key={index}
            name={criterion.name}
            description={criterion.description}
            questionId={props.question?.id ?? ""}
            criteriaId={props.question?.criteria.at(index)?.id ?? ""}
            totalMarks={marks}
            refetch={props.refetch}
          />
        );
      })}
    </div>
  );
};

interface CriteriaProps {
  name: string;
  description: string;
  questionId: string;
  criteriaId: string;
  totalMarks: number;
  refetch: QueryObserverBaseResult["refetch"];
}
const Criteria: React.FC<CriteriaProps> = (props) => {
  const [marks, setMarks] = useState("0");

  const editCriteria = api.essayQuestion.editCriteria.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const updateMarks = (newMarks: string) => {
    if (newMarks != "" && newMarks != marks) {
      // Updating the individual marks of each criteria
      setMarks(newMarks);
      editCriteria.mutate({
        id: props.criteriaId,
        name: props.name as EssayCriteriaName,
        marks: parseInt(newMarks),
      });
    }
  };
  const handleCheckChange = (status: boolean) => {
    if (status) {
      updateMarks("5");
    } else {
      updateMarks("0");
    }
  };

  useAutosave({
    data: marks,
    onSave: updateMarks,
  });

  return (
    <div className=" flex items-center space-x-4 rounded-md border p-4">
      <Switch
        checked={marks != "0"}
        onCheckedChange={(status: boolean) => handleCheckChange(status)}
      />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{props.name}</p>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
      <Input
        className="w-14"
        disabled={marks == "0"}
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
      />
    </div>
  );
};