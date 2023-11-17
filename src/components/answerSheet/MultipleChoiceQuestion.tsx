import { FormEventHandler, useEffect, useState } from "react";
import { api, type RouterOutputs } from "@/utils/api";
import { convertIntegerToASCII } from "@/utils/helper";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import MarkdownText from "@/components/MarkdownText";
import { type AnswerSheetStatus } from "@/utils/interface";
import Explanation from "@/components/answerSheet/Explanation";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
type MultipleChoiceQuestionAnswer =
  RouterOutputs["multipleChoiceQuestionAnswer"]["get"];

interface Props {
  question: MultipleChoiceQuestion;
  answer?: MultipleChoiceQuestionAnswer;
  refetch: QueryObserverBaseResult["refetch"];
  status: AnswerSheetStatus;
}

const MultipleChoiceQuestion: React.FC<Props> = (props) => {
  const hasAnswered =
    props.status == "sample-teacherview" ||
    props.status == "checking-teacherview" ||
    props.status == "returned-teacherview" ||
    props.status == "returned-studentview";

  return (
    <div className="flex w-full flex-col">
      <CardHeader>
        <CardTitle className="select-none whitespace-pre-line text-lg font-normal leading-relaxed">
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
          {/* <MarkdownText text={props.question?.text ?? ""} /> */}
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
              <ChoiceGroup
                question={props.question}
                answer={props.answer}
                refetch={props.refetch}
                status={props.status}
              />
            </div>
          </div>
        </form>
      </CardContent>

      {hasAnswered && (
        <CardFooter className="mt-8 flex flex-col items-end gap-2">
          <Explanation question={props.question} status={props.status} />
          {(props.status == "returned-teacherview" ||
            props.status == "checking-teacherview") && <EditForm {...props} />}
        </CardFooter>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;

const ChoiceGroup: React.FC<Props> = (props) => {
  const [chosenChoice, setChosenChoice] = useState(
    props.status == "sample-teacherview"
      ? props.question?.answer
      : props.answer?.studentAnswer
  );
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Retrieve data from local storage when the component mounts
    updateWithLocalStorage();

    // Add event listeners for online and offline events
    window.addEventListener("online", updateWithLocalStorage);
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      // Remove event listeners when the component unmounts
      window.removeEventListener("online", updateWithLocalStorage);
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  const updateWithLocalStorage = () => {
    const localData = localStorage.getItem(`mcq-${props.answer?.id ?? ""}`);
    if (localData) {
      const parsedLocalData = JSON.parse(localData) as number;
      setChosenChoice(parsedLocalData);

      editAnswer.mutate({
        id: props.answer?.id ?? "",
        studentAnswer: parsedLocalData,
      });
      localStorage.removeItem(`mcq-${props.answer?.id ?? ""}`);
    }
  };

  const editAnswer = api.multipleChoiceQuestionAnswer.editAnswer.useMutation({
    onSuccess: () => {
      //void props.refetch();
    },
  });

  const updateChoice = (index: number) => {
    if (props.status == "answering-studentview") {
      if (isOnline) {
        editAnswer.mutate({
          id: props.answer?.id ?? "",
          studentAnswer: index,
        });
      } else {
        localStorage.setItem(
          `mcq-${props.answer?.id ?? ""}`,
          JSON.stringify(index)
        );
      }

      setChosenChoice(index);
    }
  };

  // /**
  //  * Function to handle each change in radio value
  //  *
  //  * value format - {question id}_{choice index}
  //  */
  // const handleValueChange = (value: string) => {
  //   const word = "_";
  //   const lastIndex = value.lastIndexOf(word);
  //   const substring = value.substring(lastIndex + word.length);

  //   updateChoice(parseInt(substring));
  // };

  /**
   * Function to determine the class names of each radio button.
   *
   * Will be looped for each radio button.
   *
   * @param index of current choice
   */

  const getRadioClass = (index: number) => {
    let className = "disabled:opacity-100 select-none";
    if (props.status == "sample-teacherview") {
      // For the sample answer, automatically select the corrent choice
      if (index == props.question?.answer) {
        className = className + " border-green-400 text-green-600";
      }
    } else if (
      props.status == "checking-teacherview" ||
      props.status == "returned-studentview" ||
      props.status == "returned-teacherview"
    ) {
      if (index == props.question?.answer) {
        // For the correct answer, highlight the radio button as positive color
        className = className + " border-green-400 text-green-600";
      } else if (
        index != props.question?.answer &&
        index == props.answer?.studentAnswer
      ) {
        // If student chose the wrong answer, make the radio button have error color
        className = className + " border-red-400 text-red-500";
      }
    }

    return className;
  };

  return (
    <>
      <RadioGroup
        defaultValue={`${props.question?.id ?? ""}_${
          chosenChoice?.toString() ?? ""
        }`}
        disabled={props.status != "answering-studentview"}
      >
        {props.question?.choices.map((choice) => (
          <div key={choice.index} className="flex items-center space-x-2">
            <RadioGroupItem
              className={getRadioClass(choice.index)}
              value={`${props.question?.id ?? ""}_${choice.index?.toString()}`}
              id={`${props.question?.id ?? ""}_${choice.index?.toString()}`}
              onClick={() => updateChoice(choice.index)}
            />
            <Label
              htmlFor={`${
                props.question?.id ?? ""
              }_${choice.index?.toString()}`}
            >
              <div className="flex flex-row gap-2 font-normal">
                <p className="text-xl">
                  {convertIntegerToASCII(choice.index)})
                </p>
                <p className="text-lg">{choice.text}</p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </>
  );
};

const EditForm: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const editMarks = api.multipleChoiceQuestionAnswer.editMarks.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const editTotalMarks =
    api.multipleChoiceQuestionAnswer.editTotalMarks.useMutation({});

  const formSchema = z.object({
    marks: z.coerce
      .number()
      .min(0, {
        message: "Marks must be positive",
      })
      .max(props.question?.marks ?? 0, {
        message: "Marks must not be more than marks of question",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marks: props.answer?.marks,
    },
  });

  const updateMarks = async (oldMarks: number, newMarks: number) => {
    await editTotalMarks.mutateAsync({
      id: props.answer?.id ?? "",
      marksDifference: newMarks - oldMarks,
    });

    await editMarks.mutateAsync({
      id: props.answer?.id ?? "",
      marks: newMarks,
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOpen(false);
    void toast.promise(updateMarks(props.answer?.marks ?? 0, values.marks), {
      pending: "Editing Marks",
      success: "Edited Marks 👌",
      error: "Error in Editing Marks 🤯",
    });
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
            Edit marks. Click confirm in order to save it
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
                      <Input placeholder="shadcn" {...field} />
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
