import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

import { Copy, Share2 } from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface Props {
  url: string;
  title: string;
  oldURL: string;
}

export const ShareDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [classroomShareUrl, setClassroomShareUrl] = useState("");

  useEffect(() => {
    const bodyText = `
    Dear students,
    \n\n
    I have created a new worksheet for our upcoming assignment. Please find the worksheet attached below. Kindly complete the tasks outlined in the worksheet before the deadline.
    \n\n
    Worksheet Title: ${props.title} \n
    Worksheet Link: ${props.url} \n
    \n\n
    If you have any questions or need clarification on any of the tasks, please don't hesitate to reach out to me.
    \n\n
    Happy learning and best of luck with the assignment!
    `;

    const encodedTitle = encodeURIComponent(props.title);
    const encodedUrl = encodeURIComponent(props.url);
    const encodedBody = encodeURIComponent(bodyText);
    const shareUrl = `https://classroom.google.com/share?url=${encodedUrl}&title=${encodedTitle}&body=${encodedBody}`;
    setClassroomShareUrl(shareUrl);
  }, [props.url, props.title]);

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);

    toast.success("Link copied to your clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Link</DialogTitle>
          <DialogDescription>
            <div className="mt-4">
              <Button
                asChild
                className="flex items-center justify-center"
                onClick={() => setOpen(false)}
              >
                <a
                  href={classroomShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on Google Classroom
                </a>
              </Button>
            </div>
            <Separator className="my-4" />
            {props.url != "" ? (
              <div className="flex flex-row items-center justify-between gap-4">
                <p>
                  <span className="rounded-md border px-4 py-2 text-center">
                    {props.url}
                  </span>
                </p>

                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(props.url)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-4">
                <p className="rounded-md border px-4 py-1 text-center">
                  {props.oldURL}
                </p>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(props.oldURL)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
