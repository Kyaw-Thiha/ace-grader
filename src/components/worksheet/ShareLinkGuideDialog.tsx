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

import { type RouterOutputs } from "@/utils/api";
import { Share2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Profile = RouterOutputs["teacherProfile"]["getWorksheets"];

interface AddWorksheetButtonProps {
  profile: Profile;
}
export const ShareLinkGuideDialog: React.FC<AddWorksheetButtonProps> = ({
  profile,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasPublishedBefore = localStorage.getItem("hasPublishedBefore");

    if (profile?.worksheets.length == 1 && !hasPublishedBefore) {
      setOpen(true);
      localStorage.setItem("hasPublishedBefore", "true");
    }
  }, [profile?.worksheets.length]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Worksheet</DialogTitle>
          <DialogDescription>
            Now that you have published your first worksheet, you can share it
            to your students by clicking a
            <Button variant="outline" className="mx-2 px-2 py-1">
              <Share2Icon className="h-4 w-4" />
            </Button>
            button on the right.
          </DialogDescription>
        </DialogHeader>

        <Image
          className="mt-2 rounded-md border-2"
          src="/images/user-guide/share-link.png"
          alt="Share Link"
          width={600}
          height={300}
        />
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
