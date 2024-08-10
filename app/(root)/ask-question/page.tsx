import Question from "@/components/forms/Question";
import { getAllTags } from "@/lib/actions/tag.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Ask a Question | DevFlow",
};

const AskQuestionPage = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });

  const { tags } = await getAllTags({ filter: "name" });
  const tagList = tags.map((tag: any) => tag.name);
  
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <Question
          mongoUserId={JSON.stringify(mongoUser._id)}
          allTags={Array.isArray(tagList) ? tagList : []}
        />
      </div>
    </div>
  );
};

export default AskQuestionPage;
