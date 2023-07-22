import { useState } from "react";
import { toast } from "react-toastify";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";

import { UploadDropzone } from "@/utils/uploadthing";

import { Trash2 } from "lucide-react";
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
type Image = RouterOutputs["image"]["get"];

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {props.question?.images.map((image) => {
          return (
            <div key={image.id}>
              <div className="relative">
                <DeleteImageDialog image={image} refetch={props.refetch} />
                <Image
                  src={image.url}
                  alt={image.caption}
                  width="300"
                  height="300"
                />
              </div>

              <EditCaptionDialog image={image} refetch={props.refetch} />
            </div>
          );
        })}
      </div>
      <div className="mt-4">
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
  const [fileKey, setFileKey] = useState("");
  const [caption, setCaption] = useState("");

  //Function for deleting question
  const deleteImage = api.image.deleteUploadOnly.useMutation({});

  const handleOpenChange = async (open: boolean) => {
    if (!open && !confirm && url != "") {
      // If image has been uploaded and is not confirmed, delete it back
      await deleteImage.mutateAsync({
        id: props.question?.id ?? "",
        fileKey: fileKey,
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
            fileKey: fileKey,
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
            fileKey: fileKey,
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
      setFileKey("");
      setCaption("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => void handleOpenChange(open)}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-ellipsis text-center text-muted-foreground"
        >
          Add Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p>Upload your image and write the captions</p>
              <p>The caption will be used in AI processing.</p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {url == "" ? (
            <UploadDropzone
              endpoint="singleImageUploader"
              onClientUploadComplete={(res) => {
                setUrl(res?.at(0)?.fileUrl ?? "");
                setFileKey(res?.at(0)?.fileKey ?? "");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                console.log(`ERROR! ${error.message}`);
              }}
            />
          ) : (
            <Image src={url} alt={caption} width="500" height="500" />
          )}

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

interface ImageProps {
  image: Image;
  refetch: QueryObserverBaseResult["refetch"];
}

const EditCaptionDialog: React.FC<ImageProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState(props.image?.caption ?? "");

  //Function for deleting question
  const editCaption = api.image.editCaption.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const confirm = () => {
    setOpen(false);

    void toast.promise(
      editCaption.mutateAsync({
        id: props.image?.id ?? "",
        caption: caption,
      }),
      {
        pending: "Editing Caption",
        success: "Caption Edited 👌",
        error: "Error in Caption Editing 🤯",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full text-ellipsis text-center text-muted-foreground"
        >
          {props.image?.caption}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Caption</DialogTitle>
          <DialogDescription>
            Click save after you edit your caption
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="caption" className="text-right">
              Caption
            </Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => void confirm()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteImageDialog: React.FC<ImageProps> = (props) => {
  const [open, setOpen] = useState(false);

  //Function for deleting question
  const deleteImage = api.image.delete.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const removeImage = () => {
    setOpen(false);

    void toast.promise(
      deleteImage.mutateAsync({
        id: props.image?.id ?? "",
        fileKey: props.image?.fileKey ?? "",
      }),
      {
        pending: "Deleting Image",
        success: "Image Deleted 👌",
        error: "Error in Image Deletion 🤯",
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="absolute right-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Image</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your image?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={() => void removeImage()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
