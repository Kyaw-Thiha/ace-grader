import { type RouterOutputs } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { type AnswerSheetStatus } from "@utils/interface";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
type ShortAnswerQuestion = RouterOutputs["shortAnswerQuestion"]["get"];
type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];

interface Props {
  question: MultipleChoiceQuestion | ShortAnswerQuestion | LongAnswerQuestion;
  status: AnswerSheetStatus;
}

const Explanation: React.FC<Props> = (props) => {
  let showExplanation = false;

  if (props.status == "sample-teacherview") {
    // Show the explanation if it is the sample answer
    if (props.question?.explanation?.trim() != "") {
      showExplanation = true;
    }
  } else if (
    props.status == "checking-teacherview" ||
    props.status == "returned-studentview" ||
    props.status == "returned-teacherview"
  ) {
    // Show explanation if teacher is checking or the answer sheet has been returned
    if (props.question?.explanation?.trim() != "") {
      showExplanation = true;
    }
  } else {
    showExplanation = false;
  }

  if (showExplanation) {
    return (
      <div className="collapse-arrow collapse border border-base-300 bg-base-100">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium text-slate-800">
          Explanation
        </div>
        <div className="collapse-content">
          <p>{props.question?.explanation}</p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Explanation;