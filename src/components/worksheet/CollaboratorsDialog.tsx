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
import { useState } from "react";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface Props {
  worksheetId: string;
  refetch: QueryObserverBaseResult["refetch"];
}

export const ChangeOwnerDialog: React.FC<Props> = (props) => {
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
        <Button variant="outline">Transfer Ownership</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transfer Worksheet</DialogTitle>
          <DialogDescription>
            <p>Note: This process is irreversible</p>
            <p>Are you sure you want to change ownership of this worksheet?</p>
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
