import { api } from "@utils/api";
import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Dialog from "@components/Dialog";
import CreateMultipleChoiceQuestionDialog from "./dialog/CreateMultipleQuestionChoiceDialog";

interface Props {
  id: string;
  order: number;
  refetch: QueryObserverBaseResult["refetch"];
}

const AddQuestionButton: React.FC<Props> = ({ id, order, refetch }) => {
  const questionTypes = [
    {
      label: "Multiple Choice",
      dialogId: "create-multiple-choice-question",
    },
    {
      label: "Short Answer",
      dialogId: "create-short-answer-question",
    },
    {
      label: "Long Answer",
      dialogId: "create-long-answer-question",
    },
  ];

  return (
    <>
      <div className="dropdown">
        <label tabIndex={0} className="btn-ghost btn m-1">
          Add Question
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box w-52 gap-3 bg-base-100 p-2 shadow"
        >
          {questionTypes.map((questionType) => {
            return (
              <li key={questionType.dialogId} className="w-full">
                <label
                  htmlFor={questionType.dialogId}
                  className="btn-ghost btn"
                >
                  {questionType.label}
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Dialogs */}
      <CreateMultipleChoiceQuestionDialog
        worksheetId={id}
        dialogId={questionTypes[0]?.dialogId ?? ""}
        order={order}
        refetch={refetch}
      />
    </>
  );
};

export default AddQuestionButton;
