import { type RouterOutputs, api } from "@/utils/api";
import { useState } from "react";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  worksheetId: string;
  refetch: QueryObserverBaseResult["refetch"];
}

export const Collaborators: React.FC<Props> = (props) => {
  const [parent] = useAutoAnimate();

  const { data: worksheeet, refetch } = api.worksheet.getCollaborators.useQuery(
    {
      id: props.worksheetId,
    }
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Collaborators</Button>
      </PopoverTrigger>
      <PopoverContent asChild>
        <ScrollArea className="max-h-[400px] w-[200px] rounded-md border p-4 md:max-h-[400px] md:w-[350px]">
          <div className="mb-4 space-y-2">
            <h4 className="text-xl font-medium leading-none">Collaborators</h4>
          </div>
          <AddCollaboratorDialog
            worksheetId={props.worksheetId}
            refetch={refetch}
          />
          <div className="mt-4 flex flex-col gap-4" ref={parent}>
            {worksheeet?.collaborators?.map((collaborator) => {
              return (
                <div key={collaborator.id} className="space-y-2">
                  <div className="flex flex-row items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {collaborator.profile?.email}
                    </p>
                    <RemoveCollaboratorDialog
                      id={collaborator.id}
                      email={collaborator.profile?.email ?? ""}
                      refetch={refetch}
                    />
                  </div>

                  <Separator />
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <ChangeOwnerDialog {...props} />
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

const AddCollaboratorDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  // Function for getting user based on email
  const { refetch: fetchUserByEmail } = api.teacherProfile.getByEmail.useQuery(
    {
      email: email,
    },
    { enabled: false }
  );

  //Function for deleting question
  const addCollaborator = api.worksheet.addCollaborator.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const updateCollaborator = async () => {
    const res = await fetchUserByEmail();
    if (!res.data) {
      toast.error("No user with the email is found");
    } else {
      setOpen(false);

      await toast.promise(
        addCollaborator.mutateAsync({
          profileId: res.data.id,
          worksheetId: props.worksheetId,
        }),
        {
          pending: "Adding Collaborator",
          success: "Collaborator Added 👌",
          error: "Error in Adding Collaborator 🤯",
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Worksheet</DialogTitle>
          <DialogDescription>
            Are you sure you want to add collaborator?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => void updateCollaborator()}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface RemoveCollaboratorDialogProps {
  id: string;
  email: string;
  refetch: QueryObserverBaseResult["refetch"];
}
const RemoveCollaboratorDialog: React.FC<RemoveCollaboratorDialogProps> = (
  props
) => {
  const [open, setOpen] = useState(false);

  //Function for deleting question
  const removeCollaborator = api.worksheet.removeCollaborator.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const deleteCollaborator = async () => {
    setOpen(false);

    await toast.promise(
      removeCollaborator.mutateAsync({
        id: props.id,
      }),
      {
        pending: "Removing Collaborator",
        success: "Collaborator Removed 👌",
        error: "Error in Removing Collaborator 🤯",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove Collaborator</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove collaborator - {props.email}?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => void deleteCollaborator()}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ChangeOwnerDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  // Function for getting user based on email
  const { refetch: fetchUserByEmail } = api.teacherProfile.getByEmail.useQuery(
    {
      email: email,
    },
    { enabled: false }
  );

  //Function for deleting question
  const editOwner = api.worksheet.editProfile.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const updateOwner = async () => {
    const res = await fetchUserByEmail();
    if (!res.data) {
      toast.error("No user with the email is found");
    } else {
      setOpen(false);

      await toast.promise(
        editOwner.mutateAsync({
          id: props.worksheetId,
          profileId: res.data.id,
        }),
        {
          pending: "Transfering Worksheet",
          success: "Worksheet Transferred 👌",
          error: "Error in Worksheet Transferral 🤯",
        }
      );

      await router.push("/worksheets");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Transfer Ownership</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Worksheet</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>Note: This process is irreversible</p>
              <p>
                Are you sure you want to change ownership of this worksheet?
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => void updateOwner()}>
            Transfer Ownership
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
