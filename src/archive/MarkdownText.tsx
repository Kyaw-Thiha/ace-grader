import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import supersub from "remark-supersub";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

interface Props {
  text: string;
}

const MarkdownText: React.FC<Props> = (props) => {
  return (
    <div key="markdown" className="text-xl leading-loose">
      <ReactMarkdown
        remarkPlugins={[remarkMath, supersub]}
        rehypePlugins={[rehypeKatex]}
      >
        {props.text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownText;
