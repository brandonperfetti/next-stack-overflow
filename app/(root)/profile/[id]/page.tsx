import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import AnswersTab from "@/components/shared/AnswersTab";
import ProfileLink from "@/components/shared/ProfileLink";
import QuestionsTab from "@/components/shared/QuestionsTab";
import Stats from "@/components/shared/Stats";
import { getJoinedDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const userInfo = await getUserInfo({ userId: params.id });

  return {
    title: `${userInfo.user.name} | DevFlow`,
  };
}

const ProfilePage = async ({ params, searchParams }: URLProps) => {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}

              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}

              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={"Joined " + getJoinedDate(userInfo.user.joinedAt)}
              />
            </div>

            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badges={userInfo.badgeCounts}
        reputation={userInfo.reputation}
      />

      <div className="mt-10 flex gap-10">
        {(userInfo.totalQuestions > 0 || userInfo.totalAnswers > 0) && (
          <Tabs defaultValue="top-posts" className="flex-1">
            <TabsList className="background-light800_dark400 min-h-[42px] p-1">
              <TabsTrigger value="top-posts" className="tab">
                Top Posts
              </TabsTrigger>
              <TabsTrigger value="answers" className="tab">
                Answers
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="top-posts"
              className="mt-5 flex w-full flex-col gap-6"
            >
              {userInfo.totalQuestions > 0 ? (
                <QuestionsTab
                  searchParams={searchParams}
                  userId={userInfo.user._id}
                  clerkId={clerkId}
                />
              ) : (
                <div className="mx-auto p-9 sm:px-11">No Questions</div>
              )}
            </TabsContent>
            <TabsContent value="answers" className="flex w-full flex-col gap-6">
              {userInfo.totalAnswers > 0 ? (
                <AnswersTab
                  searchParams={searchParams}
                  userId={userInfo.user._id}
                  clerkId={clerkId}
                />
              ) : (
                <div className="mx-auto p-9 sm:px-11">No Answers</div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
