import { useState } from "react";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { MathInputDialog } from "@/components/MathInputDialog";
import MultipleChoiceQuestion from "@/components/worksheet/MultipleChoiceQuestion";
import OpenEndedQuestion from "@/components/worksheet/OpenEndedQuestion";
import EssayQuestion from "@/components/worksheet/EssayQuestion";
import ReorderButtons from "@/components/worksheet/ReorderButtons";
import { DeleteQuestionButton } from "@/components/worksheet/QuestionDialogs";
import AddQuestionButton from "@/components/worksheet/AddQuestionButton";

import { AutosizeInput } from "@/components/ui/resize-input";
import { Card } from "@/components/ui/card";
import Images from "@/components/worksheet/Images";
import { intToAlphabet, intToRoman } from "@/utils/helper";

type NestedQuestion = RouterOutputs["nestedQuestion"]["get"];

interface Props {
  question: NestedQuestion;
  refetch: QueryObserverBaseResult["refetch"];
  nestedLevel: number;
}

const NestedQuestion: React.FC<Props> = (props) => {
  const MAXNESTEDLEVEL = 3;
  const BASELEFTMARGIN = 8;

  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const questions = props.question?.childrenQuestions;

  const margins = {
    1: `ml-${BASELEFTMARGIN * 1}`,
    2: `ml-${BASELEFTMARGIN * 2}`,
    3: `ml-${BASELEFTMARGIN * 3}`,
  };

  return (
    <div className="flex flex-col gap-6">
      <Text {...props} />
      <Images
        question={props.question}
        questionType="NestedQuestion"
        refetch={props.refetch}
      />
      <div
        className={`${margins[props.nestedLevel as keyof typeof margins]} mt-4`}
        ref={parent}
      >
        {questions?.map((question) => (
          <div key={question.id} className="my-4 md:mx-8 md:rounded-md">
            <Card>
              <div className="relative">
                <label className="absolute right-1 top-1 md:right-2 md:top-2">
                  <ReorderButtons
                    questions={questions}
                    order={question.order}
                    refetch={props.refetch}
                  />
                  <DeleteQuestionButton
                    id={question.id}
                    order={question.order}
                    refetch={props.refetch}
                    questions={questions}
                  />
                </label>
              </div>
              <div className="px-2 py-4 md:px-16 md:pb-8 md:pt-4">
                <p className="my-2 text-3xl text-slate-400">
                  {props.nestedLevel == 1 && <> {question.order}.</>}
                  {props.nestedLevel == 2 && (
                    <>{intToAlphabet(question.order)}.</>
                  )}
                  {props.nestedLevel == 3 && <>{intToRoman(question.order)}.</>}
                </p>
                <div>
                  {question.questionType == "MultipleChoiceQuestion" && (
                    <MultipleChoiceQuestion
                      question={question.multipleChoiceQuestion}
                      refetch={props.refetch}
                    />
                  )}
                  {question.questionType == "OpenEndedQuestion" && (
                    <OpenEndedQuestion
                      question={question.openEndedQuestion}
                      refetch={props.refetch}
                    />
                  )}
                  {question.questionType == "EssayQuestion" && (
                    <EssayQuestion
                      question={question.essayQuestion}
                      refetch={props.refetch}
                    />
                  )}
                  {question.questionType == "NestedQuestion" && (
                    <NestedQuestion
                      question={question.nestedQuestion}
                      refetch={props.refetch}
                      nestedLevel={props.nestedLevel + 1}
                    />
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
        <div className="flex justify-center">
          <AddQuestionButton
            parentQuestionId={props.question?.id}
            order={(questions?.length ?? 0) + 1}
            refetch={props.refetch}
            nestedLevel={props.nestedLevel}
          />
        </div>
      </div>
    </div>
  );
};

export default NestedQuestion;

const Text: React.FC<Props> = (props) => {
  const [text, setText] = useState(props.question?.text ?? "");

  const editText = api.nestedQuestion.editText.useMutation({});
  const updateText = () => {
    if (text != "" && text != props.question?.text) {
      editText.mutate({ id: props.question?.id ?? "", text: text });
    }
  };
  useAutosave({
    data: text,
    onSave: updateText,
  });

  const handleMathSave = (mathText: string) => {
    // setText(text + ` \\[ ` + mathText + ` \\] `);
    setText(text + mathText);
    updateText();
  };

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

        <MathInputDialog onSave={handleMathSave} />
      </div>
    </div>
  );
};
