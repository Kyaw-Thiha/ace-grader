import * as React from "react";

import { cn } from "@/lib/utils";
import ReactTextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";

// export interface AutosizeInputProps
//   extends React.InputHTMLAttributes<HTMLTextAreaElement>,
//     TextareaAutosizeProps {}

export interface AutosizeInputProps extends TextareaAutosizeProps {}

const AutosizeInput = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(({ className, /*type,*/ ...props }, ref) => {
  return (
    <ReactTextareaAutosize
      // type={type}
      className={cn(
        "flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-800",
        className
      )}
      // ref={ref}
      {...props}
    />
  );
});
AutosizeInput.displayName = "AutosizeInput";

export { AutosizeInput };
