import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getAllTags } from "@/lib/actions/tag.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

const EditQuestionPage = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const mongoUserId = mongoUser._id.toString();
  const result = await getQuestionById({ questionId: params.id });

  const { tags } = await getAllTags({ filter: "name" });
  const tagList = tags.map((tag: any) => tag.name);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={mongoUserId}
          questionDetails={JSON.stringify(result)}
          allTags={Array.isArray(tagList) ? tagList : []}
        />
      </div>
    </>
  );
};

export default EditQuestionPage;
