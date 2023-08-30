import { useState } from "react";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { openaiAPI } from "@/server/openai/api";
import type {
  EssayQuestionCriteria,
  EssayResponse,
} from "@/server/helpers/checkAnswer";

import { Input } from "@/components/ui/input";
import { AutosizeInput } from "@/components/ui/resize-input";
import Images from "@/components/worksheet/Images";
import { Switch } from "@/components/ui/switch";
import type { EssayCriteriaName } from "@/components/worksheet/types";
import { Button } from "@/components/ui/button";
import { Criteria as AnswerCriteria } from "@/components/answerSheet/EssayQuestion";

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
      <AnswerTester question={props.question} refetch={props.refetch} />
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
    getMarks("Sentence Structure") +
    getMarks("Plot") +
    getMarks("Narrative Techniques") +
    getMarks("Descriptive Techniques") +
    getMarks("Literary Devices") +
    getMarks("Language and Vocabulary") +
    getMarks("Content") +
    getMarks("Persuasion") +
    getMarks("Purpose") +
    getMarks("Register");

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
      name: "Sentence Structure",
      description:
        "Assess the variety and effectiveness of sentence structures and syntax used in the essay. Consider the balance between simple and complex sentences, and evaluate how well the syntax contributes to the essay's readability and engagement.",
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
      name: "Descriptive Techniques",
      description:
        "Analyze the use of rich and evocative language, sensory details, and the ability to paint a clear mental picture for the reader. Consider how these techniques contribute to the depth, atmosphere, and immersive quality of the descriptive elements in the writing.",
    },
    {
      name: "Literary Devices",
      description:
        "Evaluate the incorporation of literary devices like similes, metaphors, and other figurative language in the essay. Assess their relevance, impact, and contribution to the overall quality of the writing.",
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
    {
      name: "Persuasion",
      description:
        "Evaluate the essay's ability to persuade and convince the reader in argumentative or persuasive writings. Analyze the strength of the arguments presented, the use of evidence, and the logical progression of ideas.",
    },
    {
      name: "Purpose",
      description:
        "Assess the awareness of the essay's form, intended audience, and purpose. Consider how well the writing aligns with the chosen form and effectively communicates with the target audience while fulfilling the intended purpose.",
    },
    {
      name: "Register",
      description:
        "Evaluate the use of appropriate language register in the essay. Assess whether the level of formality or informality is suitable for the intended audience and purpose, and whether it enhances the overall communication.",
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
    getMarks("Sentence Structure") +
    getMarks("Plot") +
    getMarks("Narrative Techniques") +
    getMarks("Descriptive Techniques") +
    getMarks("Literary Devices") +
    getMarks("Language and Vocabulary") +
    getMarks("Content") +
    getMarks("Persuasion") +
    getMarks("Purpose") +
    getMarks("Register");

  return (
    <div className="flex flex-col gap-4">
      {criteria.map((criterion, index) => {
        return (
          <Criteria
            key={index}
            name={criterion.name}
            description={criterion.description}
            marks={getMarks(criterion.name).toString()}
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
  marks: string;
  questionId: string;
  criteriaId: string;
  totalMarks: number;
  refetch: QueryObserverBaseResult["refetch"];
}
const Criteria: React.FC<CriteriaProps> = (props) => {
  const [marks, setMarks] = useState(props.marks);

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

interface EssayQuestionCriteriaExtended extends EssayQuestionCriteria {
  name: string;
}
const AnswerTester: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState({
    id: "",
    answerId: "",
    studentAnswer: "",
    feedback: "",
    marks: 0,
    overallImpression: "",
    criteria: [],
  });
  const [marks, setMarks] = useState(0);
  const [overallImpression, setOverallImpression] = useState("");
  const [criteria, setCriteria] = useState<EssayQuestionCriteriaExtended[]>([]);

  const checkAnswer = async () => {
    setLoading(true);

    const res = await openaiAPI.essayQuestion.generateMarksAndFeedback(
      props.question,
      answer
    );

    const data = res.data.choices[0]?.message?.content ?? "";
    const answerResponse = JSON.parse(data) as EssayResponse;

    setCriteria([]); // Emptying back the criteria from pervious responses

    const tempCriteria = [];
    for (const key of Object.keys(answerResponse)) {
      const criterion = answerResponse[key as keyof EssayResponse];

      if (key != "Overall Impression" && typeof criterion != "string") {
        tempCriteria.push({
          name: key,
          marks: criterion?.marks ?? 0,
          evaluation: criterion?.evaluation ?? "",
          suggestion: criterion?.suggestion ?? "",
        });
      }
    }
    setCriteria([...tempCriteria]);

    const marks =
      (answerResponse.Grammar?.marks ?? 0) +
      (answerResponse.Focus?.marks ?? 0) +
      (answerResponse.Exposition?.marks ?? 0) +
      (answerResponse.Organization?.marks ?? 0) +
      (answerResponse["Sentence Structure"]?.marks ?? 0) +
      (answerResponse.Plot?.marks ?? 0) +
      (answerResponse["Narrative Techniques"]?.marks ?? 0) +
      (answerResponse["Descriptive Techniques"]?.marks ?? 0) +
      (answerResponse["Literary Devices"]?.marks ?? 0) +
      (answerResponse["Language and Vocabulary"]?.marks ?? 0) +
      (answerResponse.Content?.marks ?? 0) +
      (answerResponse.Persuasion?.marks ?? 0) +
      (answerResponse.Purpose?.marks ?? 0) +
      (answerResponse.Register?.marks ?? 0);

    setMarks(marks);
    setOverallImpression(answerResponse["Overall Impression"] ?? "");
    setLoading(false);
  };

  return (
    <div className="rounded-md border-2 px-4 py-4">
      <h2 className="font-medium text-muted-foreground">Testing</h2>
      <p className="text-muted-foreground">
        You can test out how different student answers would be graded by the
        AI.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <AutosizeInput
          placeholder="Type here"
          className="transition-all"
          value={answer?.studentAnswer}
          onChange={(e) => {
            setAnswer({
              id: "",
              answerId: "",
              studentAnswer: e.target.value,
              feedback: "",
              marks: 0,
              overallImpression: "",
              criteria: [],
            });
          }}
          disabled={loading}
        />
        <Button
          className="whitespace-nowrap"
          onClick={() => void checkAnswer()}
          disabled={loading}
        >
          Check Answer
        </Button>
      </div>

      {overallImpression != "" && (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-muted-foreground">Marks: {marks}</p>

          {criteria.map((criterion, index) => {
            return (
              <AnswerCriteria
                key={index}
                name={criterion.name}
                marks={criterion.marks}
                totalMarks={
                  props.question?.criteria.find((x) => x.name == criterion.name)
                    ?.marks ?? 0
                }
                evaluation={criterion.evaluation}
                suggestion={criterion.suggestion}
              />
            );
          })}
          <p className="text-muted-foreground">{overallImpression}</p>
        </div>
      )}
    </div>
  );
};
