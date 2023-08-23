import { useState } from "react";
import MarkdownEditor from "@/archive/MarkdownEditor";
import { useAutosave } from "react-autosave";
import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import Explanation from "@/components/answerSheet/Explanation";
import type { AnswerSheetStatus } from "@/utils/interface";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
// import MarkdownText from "@/components/MarkdownText";
import SampleAnswer from "./SampleAnswer";

import { AutosizeInput } from "@/components/ui/resize-input";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { MathInputDialog } from "../MathInputDialog";

type OpenEndedQuestion = RouterOutputs["openEndedQuestion"]["get"];
type OpenEndedQuestionAnswer = RouterOutputs["openEndedQuestionAnswer"]["get"];

interface Props {
  question: OpenEndedQuestion;
  answer?: OpenEndedQuestionAnswer;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
}

const OpenEndedQuestion: React.FC<Props> = (props) => {
  const hasAnswered =
    props.status == "sample-teacherview" ||
    props.status == "checking-teacherview" ||
    props.status == "returned-teacherview" ||
    props.status == "returned-studentview";

  return (
    <div className="flex flex-col">
      <CardHeader>
        <CardTitle className="whitespace-pre-line text-lg font-normal leading-relaxed">
          <Latex
            delimiters={[
              { left: "$$", right: "$$", display: true },
              { left: "\\(", right: "\\)", display: false },
              { left: "$", right: "$", display: false },
              { left: "\\[", right: "\\]", display: false },
            ]}
          >
            {props.question?.text}
          </Latex>
        </CardTitle>
        <CardDescription>
          <div className="mt-2">
            {props.status.startsWith("returned-") ? (
              <span
                className={`rounded-md border-2 px-2 py-1 ${
                  props.answer?.marks == props.question?.marks
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                Marks: {props.answer?.marks} / {props.question?.marks}
              </span>
            ) : (
              <span className="rounded-md border-2 px-2 py-1">
                Marks: {props.question?.marks}
              </span>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="my-4 flex w-full flex-col items-center justify-center gap-2">
          {props.question?.images.map((image) => {
            return (
              <div key={image.id}>
                <Image
                  src={image.url}
                  alt={image.caption}
                  width="300"
                  height="300"
                />
              </div>
            );
          })}
        </div>

        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <StudentAnswer
                question={props.question}
                answer={props.answer}
                refetch={props.refetch}
                status={props.status}
              />
            </div>
          </div>
        </form>

        {hasAnswered && (
          <div className="mt-4 rounded-md border-2 px-4 py-2">
            Feedback: {props.answer?.feedback}
          </div>
        )}
      </CardContent>

      {hasAnswered && (
        <CardFooter className="mt-8 flex flex-col items-end gap-2">
          <Explanation question={props.question} status={props.status} />
          {(props.status == "returned-teacherview" ||
            props.status == "checking-teacherview") && <EditForm {...props} />}
          {/* <SampleAnswer
            question={props.question}
            answer={props.answer}
            status={props.status}
          /> */}
        </CardFooter>
      )}
    </div>
  );
};

export default OpenEndedQuestion;

const StudentAnswer: React.FC<Props> = (props) => {
  const [answer, setAnswer] = useState(props.answer?.studentAnswer ?? "");

  const editAnswer = api.openEndedQuestionAnswer.editAnswer.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });
  const updateAnswer = () => {
    if (answer != "" && props.status == "answering-studentview") {
      editAnswer.mutate({
        id: props.answer?.id ?? "",
        studentAnswer: answer,
      });
    }
  };
  useAutosave({ data: answer, onSave: updateAnswer });

  const handleMathSave = (text: string) => {
    setAnswer(answer + text);
    updateAnswer();
  };

  return (
    // <MarkdownEditor
    //   text={answer}
    //   label="Answer"
    //   disabled={props.status != "answering-studentview"}
    //   outlined
    //   onChange={(e) => setAnswer(e.target.value)}
    // />

    <div className="flex items-center justify-center gap-4">
      <AutosizeInput
        minRows={4}
        placeholder="Type here"
        className="text-md transition-all disabled:cursor-default disabled:opacity-100"
        disabled={props.status != "answering-studentview"}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <MathInputDialog onSave={handleMathSave} />
    </div>
  );
};

const EditForm: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const editMarksAndFeedback =
    api.openEndedQuestionAnswer.editMarksAndFeedback.useMutation({
      onSuccess: () => {
        void props.refetch();
      },
    });

  const editTotalMarks = api.openEndedQuestionAnswer.editTotalMarks.useMutation(
    {}
  );

  const formSchema = z.object({
    marks: z.coerce
      .number()
      .min(0, {
        message: "Marks must be positive",
      })
      .max(props.question?.marks ?? 0, {
        message: "Marks must not be more than marks of question",
      }),
    feedback: z.string().min(0, {
      message: "Feedback cannot be empty",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marks: props.answer?.marks,
      feedback: props.answer?.feedback,
    },
  });

  const updateMarks = async (
    oldMarks: number,
    newMarks: number,
    feedback: string
  ) => {
    await editTotalMarks.mutateAsync({
      id: props.answer?.id ?? "",
      marksDifference: newMarks - oldMarks,
    });

    await editMarksAndFeedback.mutateAsync({
      id: props.answer?.id ?? "",
      marks: newMarks,
      feedback: feedback,
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOpen(false);
    void toast.promise(
      updateMarks(props.answer?.marks ?? 0, values.marks, values.feedback),
      {
        pending: "Editing",
        success: "Edited 👌",
        error: "Error in Editing 🤯",
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Edit marks and feedback. Click confirm in order to save it
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit) as unknown as undefined}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center">
                    <FormLabel className="text-center">Marks</FormLabel>
                    <FormControl className="col-span-3">
                      <Input type="number" {...field} />
                    </FormControl>
                  </div>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center">
                    <FormLabel className="text-center">Feedback</FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="Feedback" {...field} />
                    </FormControl>
                  </div>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
