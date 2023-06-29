import { type RouterOutputs } from "@/utils/api";
import { type AnswerSheetStatus } from "@/utils/interface";
import MarkdownText from "@/components/MarkdownText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
type ShortAnswerQuestion = RouterOutputs["shortAnswerQuestion"]["get"];
type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];

interface Props {
  question: MultipleChoiceQuestion | ShortAnswerQuestion | LongAnswerQuestion;
  status: AnswerSheetStatus;
}

const MarksAndFeedback: React.FC<Props> = (props) => {
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
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h3 className="text-xl">Explanation</h3>
          </AccordionTrigger>
          <AccordionContent>
            {/* <MarkdownText text={props.question?.explanation ?? ""} /> */}
            <p className="text-lg leading-loose">
              {props.question?.explanation ?? ""}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  } else {
    return <></>;
  }
};

export default MarksAndFeedback;
