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
  const utils = api.useContext();

  //Function for editing order of question
  const editOrder = api.question.editOrder.useMutation({
    onSuccess: async () => {
      await props.refetch();
    },
    async onMutate(payload) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.worksheet.getQuestions.cancel();

      // Get the data from the queryCache
      const prevData = utils.worksheet.getQuestions.getData();

      console.log(props.questions.at(0)?.worksheetId ?? "");

      // Optimistically update the data with our new post
      utils.question.getAll.setData({}, (oldQuestions) => oldQuestions);
      utils.worksheet.getQuestions.setData(
        { id: props.questions.at(0)?.worksheetId ?? "" },
        (oldWorksheet) => {
          // Deep-Copy
          const newWorksheet = structuredClone(oldWorksheet);

          const question = newWorksheet?.questions.find(
            (question) => question.id == payload.id
          );
          const swappedQuestion = newWorksheet?.questions.find(
            (question) => question.order == payload.order
          );

          if (newWorksheet && (question?.order ?? 0) < payload.order) {
            if (newWorksheet.questions[(question?.order ?? 0) - 1])
              // Swap the questions places
              [
                // @ts-expect-error: Let's ignore a compile error like this unreachable code
                newWorksheet.questions[(question?.order ?? 0) - 1],
                // @ts-expect-error: Let's ignore a compile error like this unreachable code
                newWorksheet.questions[(swappedQuestion?.order ?? 0) - 1],
              ] = [
                newWorksheet.questions[(swappedQuestion?.order ?? 0) - 1],
                newWorksheet.questions[(question?.order ?? 0) - 1],
              ];

            // Ensure that the order number are correct
            const temp =
              newWorksheet.questions[(question?.order ?? 0) - 1]?.order;

            // @ts-expect-error: Let's ignore a compile error like this unreachable code
            newWorksheet.questions[(question?.order ?? 0) - 1] = {
              ...newWorksheet.questions[(question?.order ?? 0) - 1],
              order:
                newWorksheet.questions[(swappedQuestion?.order ?? 0) - 1]
                  ?.order ?? 0,
            };

            // @ts-expect-error: Let's ignore a compile error like this unreachable code
            newWorksheet.questions[(swappedQuestion?.order ?? 0) - 1] = {
              ...newWorksheet.questions[(swappedQuestion?.order ?? 0) - 1],
              order: temp ?? 0,
            };

            // console.log(newWorksheet.questions[(question?.order ?? 0) - 1]?.order)
            // console.log(newWorksheet.questions[(swappedQuestion?.order ?? 0) - 1]?.order)
          }

          return newWorksheet;
        }
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.worksheet.getQuestions.setData(
        { id: props.questions.at(0)?.worksheetId ?? "" },
        ctx?.prevData
      );
    },
    async onSettled() {
      // Sync with server once mutation has settled
      await utils.worksheet.getQuestions.invalidate();
    },
  });

  const swapElements = (
    array: Array<object>,
    index1: number,
    index2: number
  ) => {
    [array[index1], array[index2]] = [
      array[index2] as object,
      array[index1] as object,
    ];

    return array;
  };

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
