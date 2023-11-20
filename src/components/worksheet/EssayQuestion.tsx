import { useState } from "react";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { openaiAPI } from "@/server/openai/api";
// import type {
//   EssayQuestionCriteria,
//   EssayResponse,
// } from "@/server/helpers/checkAnswer";

import { Input } from "@/components/ui/input";
import { AutosizeInput } from "@/components/ui/resize-input";
import Images from "@/components/worksheet/Images";
import { Switch } from "@/components/ui/switch";
import type { EssayCriteriaName } from "@/components/worksheet/types";
import { Button } from "@/components/ui/button";
import { Criteria as AnswerCriteria } from "@/components/answerSheet/EssayQuestion";
import { getQuestionType } from "@/questions/derived/functions";
import type { BaseEssayQuestion } from "@/questions/base/essayQuestion";

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
      {/* <AnswerTester question={props.question} refetch={props.refetch} /> */}
    </div>
  );
};

export default EssayQuestion;

const Text: React.FC<Props> = (props) => {
  const [text, setText] = useState(props.question?.text ?? "");

  const editText = api.essayQuestion.editText.useMutation({
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

  const essayQuestionObj = getQuestionType(
    props.question?.essayType ?? ""
  ) as BaseEssayQuestion;
  const criteria = essayQuestionObj.criteria;

  const marks = criteria.reduce(
    (accumulator, criterion) => accumulator + criterion.marks,
    0
  );

  return (
    <div>
      <span className="rounded-md border-2 px-2 py-1">Marks: {marks}</span>
    </div>
  );
};

const CriteriaGroup: React.FC<Props> = (props) => {
  const essayQuestionObj = getQuestionType(
    props.question?.essayType ?? ""
  ) as BaseEssayQuestion;

  const criteria = essayQuestionObj.criteria;

  const getMarks = (name: string) => {
    return props.question?.criteria.find((x) => x.name == name)?.marks ?? 0;
  };
  const marks = criteria.reduce(
    (accumulator, criterion) => accumulator + criterion.marks,
    0
  );

  return (
    <div className="flex flex-col gap-4">
      {criteria.map((criterion, index) => {
        return (
          <Criteria
            key={index}
            name={criterion.name}
            description={criterion.description}
            marks={criterion.marks.toString()}
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
    if (newMarks != "") {
      // Updating the individual marks of each criteria
      setMarks(newMarks);

      editCriteria.mutate({
        id: props.criteriaId,
        name: props.name as EssayCriteriaName,
        description: props.description,
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
        onChange={(e) => {
          setMarks(e.target.value);
        }}
      />
    </div>
  );
};

// interface EssayQuestionCriteriaExtended extends EssayQuestionCriteria {
//   name: string;
// }
// const AnswerTester: React.FC<Props> = (props) => {
//   const [loading, setLoading] = useState(false);
//   const [answer, setAnswer] = useState({
//     id: "",
//     answerId: "",
//     studentAnswer: "",
//     feedback: "",
//     marks: 0,
//     overallImpression: "",
//     criteria: [],
//     properties: [],
//   });
//   const [marks, setMarks] = useState(0);
//   const [overallImpression, setOverallImpression] = useState("");
//   const [criteria, setCriteria] = useState<EssayQuestionCriteriaExtended[]>([]);

//   const checkAnswer = async () => {
//     setLoading(true);

//     const res = await openaiAPI.essayQuestion.generateMarksAndFeedback(
//       props.question,
//       answer
//     );

//     const data = res.data.choices[0]?.message?.content ?? "";
//     const answerResponse = JSON.parse(data) as EssayResponse;

//     setCriteria([]); // Emptying back the criteria from pervious responses

//     const tempCriteria = [];
//     for (const key of Object.keys(answerResponse)) {
//       const criterion = answerResponse[key as keyof EssayResponse];

//       if (key != "Overall Impression" && typeof criterion != "string") {
//         tempCriteria.push({
//           name: key,
//           marks: criterion?.marks ?? 0,
//           evaluation: criterion?.evaluation ?? "",
//           suggestion: criterion?.suggestion ?? "",
//         });
//       }
//     }
//     setCriteria([...tempCriteria]);

//     const marks =
//       (answerResponse.Grammar?.marks ?? 0) +
//       (answerResponse.Focus?.marks ?? 0) +
//       (answerResponse.Exposition?.marks ?? 0) +
//       (answerResponse.Organization?.marks ?? 0) +
//       (answerResponse["Sentence Structure"]?.marks ?? 0) +
//       (answerResponse.Plot?.marks ?? 0) +
//       (answerResponse["Narrative Techniques"]?.marks ?? 0) +
//       (answerResponse["Descriptive Techniques"]?.marks ?? 0) +
//       (answerResponse["Literary Devices"]?.marks ?? 0) +
//       (answerResponse["Language and Vocabulary"]?.marks ?? 0) +
//       (answerResponse.Content?.marks ?? 0) +
//       (answerResponse.Persuasion?.marks ?? 0) +
//       (answerResponse.Purpose?.marks ?? 0) +
//       (answerResponse.Register?.marks ?? 0);

//     setMarks(marks);
//     setOverallImpression(answerResponse["Overall Impression"] ?? "");
//     setLoading(false);
//   };

//   return (
//     <div className="rounded-md border-2 px-4 py-4">
//       <h2 className="font-medium text-muted-foreground">Testing</h2>
//       <p className="text-muted-foreground">
//         You can test out how different student answers would be graded by the
//         AI.
//       </p>
//       <div className="mt-4 flex items-center gap-4">
//         <AutosizeInput
//           placeholder="Type here"
//           className="transition-all"
//           value={answer?.studentAnswer}
//           onChange={(e) => {
//             setAnswer({
//               id: "",
//               answerId: "",
//               studentAnswer: e.target.value,
//               feedback: "",
//               marks: 0,
//               overallImpression: "",
//               criteria: [],
//             });
//           }}
//           disabled={loading}
//         />
//         <Button
//           className="whitespace-nowrap"
//           onClick={() => void checkAnswer()}
//           disabled={loading}
//         >
//           Check Answer
//         </Button>
//       </div>

//       {overallImpression != "" && (
//         <div className="mt-4 flex flex-col gap-4">
//           <p className="text-muted-foreground">Marks: {marks}</p>

//           {criteria.map((criterion, index) => {
//             return (
//               <AnswerCriteria
//                 key={index}
//                 name={criterion.name}
//                 marks={criterion.marks}
//                 totalMarks={
//                   props.question?.criteria.find((x) => x.name == criterion.name)
//                     ?.marks ?? 0
//                 }
//                 evaluation={criterion.evaluation}
//                 suggestion={criterion.suggestion}
//               />
//             );
//           })}
//           <p className="text-muted-foreground">{overallImpression}</p>
//         </div>
//       )}
//     </div>
//   );
// };
