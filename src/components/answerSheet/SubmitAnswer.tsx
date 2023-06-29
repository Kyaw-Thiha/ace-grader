import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { api } from "@/utils/api";
import { useState } from "react";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface SubmitAnswerDialogProps {
  worksheetId: string;
  answerSheetId: string;
  refetch: QueryObserverBaseResult["refetch"];
}

export const SubmitAnswerDialog: React.FC<SubmitAnswerDialogProps> = (
  props
) => {
  const [open, setOpen] = useState(false);

  //Function for deleting question
  const checkAnswer = api.answerSheet.checkAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const submitAnswer = () => {
    setOpen(false);

    void toast.promise(
      checkAnswer.mutateAsync({
        worksheetId: props.worksheetId,
        answerSheetId: props.answerSheetId,
      }),
      {
        pending: "Checking Answers",
        success: "Answers Checked 👌",
        error: "Error in Answer Checking 🤯",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full">
        <Button>Submit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit your answers</DialogTitle>
          <DialogDescription>
            <p>Note: This process is irreversible</p>
            <p>Are you sure you want to submit your answers?</p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => submitAnswer()}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
