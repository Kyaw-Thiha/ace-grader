import { type RouterOutputs } from "@utils/api";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"];

interface Props {
  question: MultipleChoiceQuestion;
}

const MultipleChoiceQuestion: React.FC<Props> = ({ question }) => {
  return <></>;
};

export default MultipleChoiceQuestion;
