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

import { api } from "@/utils/api";
import { useState } from "react";
import { toast } from "react-toastify";

export const AddWorksheetButton: React.FC = () => {
  const [title, setTitle] = useState("");

  const { data, refetch: refetchProfiles } =
    api.teacherProfile.getWorksheets.useQuery(
      undefined // no input
    );

  //Fetching the teacher profiles
  const { data: profiles } = api.teacherProfile.getAll.useQuery(
    undefined // no input
  );

  //Function for creating worksheet
  const createWorksheet = api.worksheet.create.useMutation({
    onSuccess: () => {
      void refetchProfiles();
    },
  });

  const addWorksheet = () => {
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
      void toast.promise(
        createWorksheet.mutateAsync({
          title: title,
          profileId: profiles?.id ?? "",
        }),
        {
          pending: "Creating Worksheet",
          success: "Worksheet Created 👌",
          error: "Error in Worksheet Creation 🤯",
        }
      );
    }

    setTitle("");
  };

  return (
    <Dialog>
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
            <Input id="title" value={title} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Worksheet</Button>
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
  const [text, setText] = useState("");

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
    if (text != worksheetTitle) {
      // If title is not entered
      toast.error("Your input text is incorrect");
    } else {
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
    }

    setText("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Delete Worksheet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Worksheet</DialogTitle>
          <DialogDescription>
            Note: This process is irreversible.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Please type in<b className="ml-2">{worksheetTitle}</b> below to
              proceed with worksheet removal
            </Label>
            <Input id="text" value={text} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Delete Worksheet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
