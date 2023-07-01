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

interface SubmitAnswerDialogProps {
  worksheetId: string;
  answerSheetId: string;
  refetch: QueryObserverBaseResult["refetch"];
  onSubmit: () => void;
}

export const SubmitAnswerDialog: React.FC<SubmitAnswerDialogProps> = (
  props
) => {
  const [open, setOpen] = useState(false);

  //Function for checking the answers
  const checkAnswer = api.answerSheet.checkAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  //Function for setting the submission time
  const setEndTime = api.answerSheet.setEndTime.useMutation({});

  const submitAnswer = () => {
    setOpen(false);
    props.onSubmit();

    const today = new Date();
    void setEndTime.mutateAsync({ id: props.answerSheetId, endTime: today });

    void checkAnswer.mutateAsync({
      worksheetId: props.worksheetId,
      answerSheetId: props.answerSheetId,
    });

    // Uncomment this when debugging
    //
    // void toast.promise(
    //   checkAnswer.mutateAsync({
    //     worksheetId: props.worksheetId,
    //     answerSheetId: props.answerSheetId,
    //   }),
    //   {
    //     pending: "Checking Answers",
    //     success: "Answers Checked 👌",
    //     error: "Error in Answer Checking 🤯",
    //   }
    // );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="px-40">
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
