import type { QueryObserverBaseResult } from "@tanstack/react-query";
import { api, type RouterOutputs } from "@/utils/api";
import { MoveDown, MoveUp } from "lucide-react";

import { Button } from "@/components/ui/button";

type Questions = RouterOutputs["question"]["getAll"];
interface Props {
  questions: Questions;
  order: number;
  refetch: QueryObserverBaseResult["refetch"];
}

const ReorderButtons: React.FC<Props> = (props) => {
  //Function for editing order of question
  const editOrder = api.question.editOrder.useMutation({
    onSuccess: async () => {
      await props.refetch();
    },
  });

  // Note: order starts at 1.

  const moveUp = () => {
    const prevQuestion = props.questions[props.order - 2];
    const currentQuestion = props.questions[props.order - 1];

    // Moving the current question down
    editOrder.mutate({
      id: currentQuestion?.id ?? "",
      order: (currentQuestion?.order ?? 0) - 1,
    });
    // Moving the prev question up
    editOrder.mutate({
      id: prevQuestion?.id ?? "",
      order: (prevQuestion?.order ?? 0) + 1,
    });
  };

  const moveDown = () => {
    const nextQuestion = props.questions[props.order];
    const currentQuestion = props.questions[props.order - 1];

    // Moving the current question up
    editOrder.mutate({
      id: currentQuestion?.id ?? "",
      order: (currentQuestion?.order ?? 0) + 1,
    });
    // Moving the prev question down
    editOrder.mutate({
      id: nextQuestion?.id ?? "",
      order: (nextQuestion?.order ?? 0) - 1,
    });
  };

  return (
    <>
      {props.order != props.questions.length && (
        <Button variant="ghost" className="px-2" onClick={moveDown}>
          <MoveDown className="h-4 w-4" />
        </Button>
      )}

      {props.order != 1 && (
        <Button variant="ghost" className="px-2" onClick={moveUp}>
          <MoveUp className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};

export default ReorderButtons;
