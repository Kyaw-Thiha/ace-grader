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
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

type Profile = RouterOutputs["teacherProfile"]["getWorksheets"];

interface AddWorksheetButtonProps {
  profile: Profile;
  refetch: QueryObserverBaseResult["refetch"];
}
export const AddWorksheetButton: React.FC<AddWorksheetButtonProps> = ({
  profile,
  refetch,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  //Function for creating worksheet
  const createWorksheet = api.worksheet.create.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const addWorksheet = async () => {
    if (title.trim() == "") {
      // If title is not entered
      toast.error("Enter a title");
    } else if (title.split(" ").length > 20) {
      // If title is above word limit
      toast.error("Your title cannot have more than 20 words");
    } else if (title.length > 250) {
      // If title is above character limit
      toast.error("Your title cannot have more than 250 characters");
    } else {
      setOpen(false);

      const createdWorksheet = await toast.promise(
        createWorksheet.mutateAsync({
          title: title,
          profileId: profile?.id ?? "",
        }),
        {
          pending: "Creating Worksheet",
          success: "Worksheet Created 👌",
          error: "Error in Worksheet Creation 🤯",
        }
      );
      void router.push(`/worksheets/${createdWorksheet.id}`);
    }

    setTitle("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Worksheet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Worksheet</DialogTitle>
          <DialogDescription>
            Make changes to your worksheet here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => void addWorksheet()}>
            Create Worksheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteWorksheetButtonProps {
  worksheetId: string;
  worksheetTitle: string;
}
export const DeleteWorksheetButton: React.FC<DeleteWorksheetButtonProps> = ({
  worksheetId,
  worksheetTitle,
}) => {
  const [open, setOpen] = useState(false);

  const { data, refetch: refetchProfiles } =
    api.teacherProfile.getWorksheets.useQuery(
      undefined // no input
    );

  //Function for creating worksheet
  const deleteWorksheet = api.worksheet.delete.useMutation({
    onSuccess: () => {
      void refetchProfiles();
    },
  });

  const removeWorksheet = () => {
    setOpen(false);

    void toast.promise(
      deleteWorksheet.mutateAsync({
        id: worksheetId,
      }),
      {
        pending: "Removing Worksheet",
        success: "Worksheet Removed 👌",
        error: "Error in Worksheet Deletion 🤯",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Worksheet</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>Are you sure you want to delete this worksheet?</p>
              <p>Note: This process is irreversible.</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => removeWorksheet()}>
            Delete Worksheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
