import { type RouterOutputs } from "@/utils/api";
import { type AnswerSheetStatus } from "@/utils/interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Latex from "react-latex-next";

type MultipleChoiceQuestion = RouterOutputs["multipleChoiceQuestion"]["get"];
type ShortAnswerQuestion = RouterOutputs["shortAnswerQuestion"]["get"];
type OpenEndedQuestion = RouterOutputs["openEndedQuestion"]["get"];

interface Props {
  question: MultipleChoiceQuestion | ShortAnswerQuestion | OpenEndedQuestion;
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
      <>
        <Accordion className="w-full" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h3 className="text-lg">Explanation</h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-md whitespace-pre-line leading-relaxed">
                <Latex
                  delimiters={[
                    { left: "$$", right: "$$", display: true },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "$", right: "$", display: false },
                    { left: "\\[", right: "\\]", display: false },
                  ]}
                >
                  {props.question?.explanation}
                </Latex>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </>
    );
  } else {
    return <></>;
  }
};

export default Explanation;
