import { SearchParamsProps } from "@/types";

interface AnswersTabProps extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

const AnswersTab = async ({
  searchParams,
  userId,
  clerkId,
}: AnswersTabProps) => {
  return <div>AnswersTab</div>;
};

export default AnswersTab;
