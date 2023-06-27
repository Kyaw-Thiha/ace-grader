import * as React from "react";

import { cn } from "@/lib/utils";
import ReactTextareaAutosize from "react-textarea-autosize";

export interface AutosizeInputProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {}

const AutosizeInput = React.forwardRef<HTMLTextAreaElement, AutosizeInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <ReactTextareaAutosize
        // type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        // ref={ref}
        {...props}
      />
    );
  }
);
AutosizeInput.displayName = "AutosizeInput";

export { AutosizeInput };