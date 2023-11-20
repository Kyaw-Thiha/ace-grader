import { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { type RouterOutputs, api } from "@/utils/api";
import type { QueryObserverBaseResult } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

type EssayAnswerCriteria =
  RouterOutputs["essayAnswer"]["getEssayAnswerCriteria"];

interface Props {
  criteria: EssayAnswerCriteria;
  answerSheetId?: string;
  totalMarks?: number;
  refetch: QueryObserverBaseResult["refetch"];
}

export const EditEssayCriteriaDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const [level, setLevel] = useState(props.criteria?.level ?? "");
  const [evaluation, setEvaluation] = useState(
    props.criteria?.evaluation ?? ""
  );
  const [marks, setMarks] = useState(props.criteria?.marks.toString() ?? "");

  // Function for editing EssayCriteria
  const editCriteria = api.essayAnswer.editCriteriaAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  // Function for editing EssayCriteria
  const editMarks = api.answerSheet.editTotalMarks.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const edit = async () => {
    await editMarks.mutateAsync({
      id: props.answerSheetId ?? "",
      totalMarks:
        (props.totalMarks ?? 0) - (props.criteria?.marks ?? 0) + Number(marks),
    });

    await editCriteria.mutateAsync({
      level: level,
      evaluation: evaluation,
      marks: Number(marks),
      id: props.criteria?.id ?? "",
    });
  };

  const addWorksheet = async () => {
    if (level.trim() == "") {
      // If title is not entered
      toast.error("Enter a Level");
    } else if (level.length > 250) {
      // If title is above character limit
      toast.error("Your level cannot have more than 250 characters");
    } else if (evaluation.trim() == "") {
      // If country is not chosen
      toast.error("Enter an evaluation");
    } else if (marks.trim() == "") {
      // If curriculum is not chosen
      toast.error("Ensure you have enter the marks.");
    } else {
      setOpen(false);

      await toast.promise(edit(), {
        pending: "Editing Criteria",
        success: "Criteria Editted 👌",
        error: "Error in Criteria Editting 🤯",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Criteria Answer</DialogTitle>
          <DialogDescription>
            Edit the details of the criteria here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Level
            </Label>
            <Input
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="evaluation" className="text-right">
              Evaluation
            </Label>
            <Input
              id="evaluation"
              value={evaluation}
              onChange={(e) => setEvaluation(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="marks" className="text-right">
              Marks
            </Label>
            <Input
              id="marks"
              type="number"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => void addWorksheet()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
