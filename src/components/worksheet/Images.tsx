import { useState } from "react";
import { toast } from "react-toastify";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";

import { UploadDropzone } from "@/utils/uploadthing";

import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
type ShortAnswerQuestion = RouterOutputs["shortAnswerQuestion"]["get"];
type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];

interface Props {
  questionType:
    | "MultipleChoiceQuestion"
    | "ShortAnswerQuestion"
    | "LongAnswerQuestion";
  question: MultipleChoiceQuestion | ShortAnswerQuestion | LongAnswerQuestion;
  refetch: QueryObserverBaseResult["refetch"];
}

const Images: React.FC<Props> = (props) => {
  return (
    <div>
      <div className="grid grid-cols-4">
        {props.question?.images.map((image) => {
          return (
            <div key={image.id}>
              <Image src={image.url} alt={image.caption} />
              <caption className="text-accent-foreground">
                {image.caption}
              </caption>
            </div>
          );
        })}
        <AddImageDialog
          question={props.question}
          questionType={props.questionType}
          refetch={props.refetch}
        />
      </div>
    </div>
  );
};

export default Images;

const AddImageDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  //Function for deleting question
  const deleteImage = api.image.deleteUploadOnly.useMutation({});

  const handleOpenChange = async (open: boolean) => {
    if (!open && !confirm && url != "") {
      // If image has been set and is not confirmed, delete it back
      await deleteImage.mutateAsync({
        id: props.question?.id ?? "",
        url: url,
      }),
        {
          pending: "Removing Question",
          success: "Question Removed 👌",
          error: "Error in Question Deletion 🤯",
        };
      setUrl("");
    }
    setOpen(open);
  };

  //Functions for adding image
  const addImageToMultipleChoiceQuestion =
    api.multipleChoiceQuestion.addImage.useMutation({
      onSuccess: () => {
        void props.refetch();
      },
    });
  const addImageToLongAnswerQuestion =
    api.longAnswerQuestion.addImage.useMutation({
      onSuccess: () => {
        void props.refetch();
      },
    });

  const handleConfirm = async () => {
    if (url == "") {
      toast.error("You need to upload your image first");
    } else {
      setConfirm(true);

      if (props.questionType == "MultipleChoiceQuestion") {
        await toast.promise(
          addImageToMultipleChoiceQuestion.mutateAsync({
            id: props.question?.id ?? "",
            url: url,
            caption: caption,
          }),
          {
            pending: "Adding Image",
            success: "Image  added 👌",
            error: "Error in Image Creation 🤯",
          }
        );
      } else if (props.questionType == "LongAnswerQuestion") {
        await toast.promise(
          addImageToLongAnswerQuestion.mutateAsync({
            id: props.question?.id ?? "",
            url: url,
            caption: caption,
          }),
          {
            pending: "Adding Image",
            success: "Image  added 👌",
            error: "Error in Image Creation 🤯",
          }
        );
      }

      // Reseting the state after creating image
      setUrl("");
      setCaption("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => void handleOpenChange(open)}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Image</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>
            <p>Upload your image and write the captions</p>
            <p>The caption will be used in AI processing.</p>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              setUrl(res?.at(0)?.fileUrl ?? "");
              console.log("Files: ", res);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              console.log(`ERROR! ${error.message}`);
            }}
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Caption
            </Label>
            <Input
              id="title"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => void handleConfirm()}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
