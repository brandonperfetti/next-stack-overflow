import QuestionCard, { QuestionProps } from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/Home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions: QuestionProps[] = [
  {
    _id: "q1",
    title: "How to implement authentication in Node.js?",
    tags: [
      { _id: "t1", name: "Node.js" },
      { _id: "t2", name: "Authentication" },
    ],
    author: {
      _id: "u1",
      name: "Alice Johnson",
      picture: "https://example.com/alice.jpg",
    },
    upvotes: 42,
    views: 1587,
    answers: [
      { id: "a1", content: "Use Passport.js for easy integration" },
      { id: "a2", content: "Implement JWT for stateless authentication" },
    ],
    createdAt: new Date("2024-03-15T09:23:14.000Z"),
  },
  {
    _id: "q2",
    title: "Best practices for React state management in 2024?",
    tags: [
      { _id: "t3", name: "React" },
      { _id: "t4", name: "State Management" },
    ],
    author: {
      _id: "u2",
      name: "Bob Smith",
      picture: "https://example.com/bob.jpg",
    },
    upvotes: 78,
    views: 3254,
    answers: [
      { id: "a3", content: "Use React Query for server state" },
      { id: "a4", content: "Zustand is great for simple global state" },
      { id: "a5", content: "Consider Jotai for atomic state management" },
    ],
    createdAt: new Date("2024-07-02T14:45:30.000Z"),
  },
];

const Home = () => {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="right"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There&rsquo;s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default Home;
