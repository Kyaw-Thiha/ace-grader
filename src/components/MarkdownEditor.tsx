import { type ChangeEventHandler, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you
import ReactTextareaAutosize from "react-textarea-autosize";

interface Props {
  label: string;
  text: string;
  // onChange: ChangeEventHandler<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
}

const MarkdownEditor: React.FC<Props> = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-w-[12vw]">
      {isEditing ? (
        <div key="input" className="">
          <p className="text-slate-400">{props.label}</p>
          <ReactTextareaAutosize
            placeholder="Type here"
            className="input-bordered input w-[80vw] overflow-hidden py-4 transition-all"
            autoFocus
            value={props.text}
            onChange={props.onChange}
            onBlur={() => setIsEditing(false)}
          ></ReactTextareaAutosize>
        </div>
      ) : (
        <div
          key="markdown"
          className="max-w-[80vw] rounded-md border-4 border-transparent py-1 transition-all hover:border-slate-200 hover:px-4"
          onClick={() => setIsEditing(true)}
        >
          <p className="text-slate-400">{props.label}</p>
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {props.text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
