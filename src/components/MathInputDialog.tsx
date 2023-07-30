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

import { Sigma } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MathInput from "react-math-keyboard";

interface Props {
  onSave: (text: string) => void;
}

export const MathInputDialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  //https://cortexjs.io/mathlive/

  const save = () => {
    setOpen(false);
    setText("");

    props.onSave(text);
  };

  const numericToolbarKeys = [
    {
      id: "differentiate",
      label: "d/dx",
      labelType: "raw",
      mathfieldInstructions: {
        method: "write",
        content: `\\frac{d}{dx} (x)`,
      },
    },
    {
      id: "integrate",
      label: "∫",
      labelType: "raw",
      mathfieldInstructions: {
        method: "write",
        content: `\\int_{a}^{b} (x)\\ dx`,
      },
    },
    {
      id: "pi",
      label: "π",
      labelType: "raw",
      mathfieldInstructions: {
        method: "write",
        content: `\\pi`,
      },
    },
    {
      id: "degree",
      label: "°",
      labelType: "raw",
      mathfieldInstructions: {
        method: "write",
        content: `\\degree`,
      },
    },
    {
      id: "superscript",
      label: "x^2",
      labelType: "tex",
      mathfieldInstructions: {
        method: "write",
        content: `x^2`,
      },
    },
    {
      id: "subscript",
      label: "u_n",
      labelType: "tex",
      mathfieldInstructions: {
        method: "write",
        content: `u_n`,
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Add <Sigma className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Math Symbol</DialogTitle>
          <DialogDescription>
            Enter text with math symbol here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text" className="text-right">
              Text
            </Label>
            <div className="col-span-3 mt-2 flex rounded-md bg-transparent text-sm ring-offset-white transition-all placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-800">
              <MathInput
                id="text"
                placeholder="Type here"
                initialLatex={text}
                setValue={setText}
                divisionFormat="obelus"
                size="small"
                // allowAlphabeticKeyboard={false}
                // numericToolbarTabs={["trigo", "greek"]}
                numericToolbarKeys={numericToolbarKeys}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={() => save()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
