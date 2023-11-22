import { useState } from "react";

import { api, type RouterOutputs } from "@/utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  id: string;
  marks: number;
  maxMarks: number;
  refetch: QueryObserverBaseResult["refetch"];
}

export const EditTotalMarks: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  //   const [marks, setMarks] = useState(props.marks);

  const editMarks = api.answerSheet.editTotalMarks.useMutation({
    onSuccess: () => {
      void props.refetch();
    },
  });

  const formSchema = z.object({
    marks: z.coerce
      .number()
      .min(0, {
        message: "Marks must be positive",
      })
      .max(props.maxMarks, {
        message: "Marks must not be more than total marks of worksheet",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marks: props.marks,
    },
  });

  const updateMarks = async (marks: number) => {
    await editMarks.mutateAsync({
      id: props.id,
      totalMarks: marks,
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOpen(false);
    void toast.promise(updateMarks(values.marks), {
      pending: "Editing",
      success: "Edited 👌",
      error: "Error in Editing 🤯",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8">Edit</Button>
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
                      <Input type="number" {...field} />
                    </FormControl>
                  </div>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Confirm</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
