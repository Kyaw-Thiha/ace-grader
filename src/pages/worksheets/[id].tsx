import { useRouter } from "next/router";

const WorksheetEditor = () => {
  const router = useRouter();

  const worksheetId = router.query.id as string;

  return <div></div>;
};

export default WorksheetEditor;
