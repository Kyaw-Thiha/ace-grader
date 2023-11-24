import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const JoinWithCodePage: NextPage = () => {
  return <SubmitCodeForm code="" />;
};

interface Props {
  code: string;
}

export const SubmitCodeForm: React.FC<Props> = (props) => {
  const router = useRouter();

  const [code, setCode] = useState(props.code);

  const {
    data,
    refetch: fetchCode,
    isInitialLoading,
  } = api.publishedWorksheet.checkForCode.useQuery(
    { code: code },
    { enabled: false }
  );

  useEffect(() => {
    if (props.code != "") {
      void onSubmit({ code: props.code });
    }
  }, [props.code]);

  const formSchema = z.object({
    code: z.coerce.string().length(10, {
      message: "Code length is incorrect",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.code != "") {
      setCode(values.code);

      const res = await fetchCode();
      const id = res.data?.id ?? "";

      if (res.data) {
        void router.push(`/published-worksheets/${id}`);
      } else {
        toast.error("No worksheet found");
      }
    }
  }

  return (
    <div className="mt-40 flex justify-center md:mt-20">
      <div className="flex flex-col gap-8">
        <Card className="md:px-32 md:py-32">
          <CardHeader>
            <CardTitle>Join with Code</CardTitle>
            <CardDescription>
              Enter the unique code that you have been provided.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit) as unknown as undefined}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center">
                        <FormLabel className="text-center">Code</FormLabel>
                        <FormControl className="col-span-3">
                          <Input {...field} />
                        </FormControl>
                      </div>

                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isInitialLoading}>
                  Join
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinWithCodePage;
