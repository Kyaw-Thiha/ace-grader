"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Data {
  value: string;
  label: string;
  [key: string]: any;
}
interface Props {
  data: Data[];
  name: string;
  value: string;
  setValue: (val: string) => void;
}

export const Combobox: React.FC<Props> = (props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {props.value
            ? props.data.find((datum) => datum.value === props.value)?.label
            : `Select ${props.name}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${props.name}...`} />
          <CommandEmpty>No {props.name} found.</CommandEmpty>
          <CommandGroup>
            {props.data.map((datum) => (
              <CommandItem
                key={datum.value}
                onSelect={(currentValue) => {
                  props.setValue(
                    currentValue.replaceAll(" ", "-") === props.value
                      ? ""
                      : currentValue.replaceAll(" ", "-")
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    props.value === datum.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {datum.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
