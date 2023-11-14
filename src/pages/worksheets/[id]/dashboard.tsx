import type {
  NextPage,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { api } from "@/utils/api";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { formatDateWithSuffix } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TopNavLayout from "@/components/TopNavLayout";

export function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params?.["id"];
  const worksheetId = id as string;

  return {
    props: {
      id: worksheetId,
    },
  };
}

const Dashboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  return (
    <>
      <TopNavLayout>
        <AnswerSheetList id={id} />
      </TopNavLayout>
    </>
  );
};

interface Props {
  id: string;
}
const AnswerSheetList: React.FC<Props> = ({ id }) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);

  //Fetching the worksheet
  const {
    data: worksheet,
    isLoading,
    isError,
  } = api.worksheet.getFinishedAnswerSheets.useQuery({ id: id });
  const publishedWorksheets = worksheet?.publishedWorksheets ?? [];
  const answerSheets = [];

  return (
    <>
      <h2 className="text-xl font-medium">Answer Sheets</h2>
      <section className="mt-8" ref={parent}>
        <Table>
          <TableCaption>A list of answer sheets.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Marks</TableHead>
              <TableHead className="text-center">
                Window Changed Count
              </TableHead>
              <TableHead className="text-center">Date Answered</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publishedWorksheets.map((publishedWorksheet) => {
              return (
                <>
                  {publishedWorksheet.answerSheets.map((answerSheet) => {
                    return (
                      <TableRow key={answerSheet.id} className="text-center">
                        <TableCell className="font-medium">
                          {answerSheet.studentName}
                        </TableCell>
                        <TableCell>{answerSheet.studentEmail}</TableCell>
                        <TableCell>
                          {answerSheet.totalMarks} /{" "}
                          {publishedWorksheet.totalMarks}
                        </TableCell>
                        <TableCell>{answerSheet.switchWindowCount}</TableCell>
                        <TableCell>
                          {formatDateWithSuffix(answerSheet.endTime)}
                        </TableCell>
                        <TableCell>
                          <Button asChild>
                            <Link
                              href={`/published-worksheets/${publishedWorksheet.id}/answer/${answerSheet.id}`}
                            >
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </>
  );
};

export default Dashboard;
