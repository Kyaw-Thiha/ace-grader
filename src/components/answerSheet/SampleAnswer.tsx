import { type RouterOutputs } from "@/utils/api";
import { type AnswerSheetStatus } from "@/utils/interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type LongAnswerQuestion = RouterOutputs["longAnswerQuestion"]["get"];
type LongAnswerQuestionAnswer =
  RouterOutputs["longAnswerQuestionAnswer"]["get"];

interface Props {
  question: LongAnswerQuestion;
  answer?: LongAnswerQuestionAnswer;
  status: AnswerSheetStatus;
}

const SampleAnswer: React.FC<Props> = (props) => {
  let showSampleAnswer = false;

  if (props.status == "sample-teacherview") {
    // Show the explanation if it is the sample answer
    if (props.question?.sampleAnswer?.trim() != "") {
      showSampleAnswer = true;
    }
  } else if (
    props.status == "checking-teacherview" ||
    props.status == "returned-studentview" ||
    props.status == "returned-teacherview"
  ) {
    // Show explanation if teacher is checking or the answer sheet has been returned
    if (props.question?.sampleAnswer?.trim() != "") {
      showSampleAnswer = true;
    }
  } else {
    showSampleAnswer = false;
  }

  if (showSampleAnswer) {
    return (
      <Accordion className="w-full" type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h3 className="text-lg">Sample Answer</h3>
          </AccordionTrigger>
          <AccordionContent>
            {/* <MarkdownText text={props.question?.explanation ?? ""} /> */}
            <p className="text-md leading-relaxed">
              {props.question?.sampleAnswer ?? ""}
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  } else {
    return <></>;
  }
};

export default SampleAnswer;
