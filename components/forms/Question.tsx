"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/context/ThemeProvider";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { cn } from "@/lib/utils";
import { QuestionsSchema } from "@/lib/validations";
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "../ui/use-toast";

interface QuestionProps {
  type?: string;
  mongoUserId: string;
  questionDetails?: string;
  allTags?: string[];
}

interface ParsedQuestionDetails {
  _id?: string;
  title: string;
  content: string;
  tags: { name: string }[];
}

const Question = ({
  type,
  mongoUserId,
  questionDetails,
  allTags = [],
}: QuestionProps) => {
  const { mode } = useTheme();
  const editorRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const parsedQuestionDetails: ParsedQuestionDetails = useMemo(() => {
    if (questionDetails && questionDetails.trim() !== "") {
      try {
        return JSON.parse(questionDetails) as ParsedQuestionDetails;
      } catch (error) {
        console.error("Error parsing questionDetails:", error);
      }
    }
    return {
      title: "",
      content: "",
      tags: [],
    };
  }, [questionDetails]);

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: parsedQuestionDetails.title || "",
      explanation: parsedQuestionDetails.content || "",
      tags: parsedQuestionDetails.tags.map((tag) => tag.name) || [],
    },
  });

  const { setValue, watch } = form;
  const selectedTags = watch("tags");

  useEffect(() => {
    // Only set the form values if they're different from the current values
    const currentTitle = form.getValues("title");
    const currentExplanation = form.getValues("explanation");
    const currentTags = form.getValues("tags");

    if (parsedQuestionDetails.title !== currentTitle) {
      form.setValue("title", parsedQuestionDetails.title);
    }
    if (parsedQuestionDetails.content !== currentExplanation) {
      form.setValue("explanation", parsedQuestionDetails.content);
    }
    const newTags = parsedQuestionDetails.tags.map((tag) => tag.name);
    if (JSON.stringify(newTags) !== JSON.stringify(currentTags)) {
      form.setValue("tags", newTags);
    }
  }, [parsedQuestionDetails, form]);

  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true);

    try {
      if (type === "Edit" && parsedQuestionDetails._id) {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          path: pathname,
        });
        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleTagSelect = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : selectedTags.length < 3
        ? [...selectedTags, tag]
        : selectedTags;

    if (
      updatedTags.length === selectedTags.length &&
      selectedTags.length >= 3
    ) {
      toast({
        title: "Maximum Tags Reached",
        description: "You can only add up to 3 tags per question.",
        variant: "destructive",
      });
    } else {
      setValue("tags", updatedTags);
    }
    setSearchValue("");
    setOpenCombobox(false);
  };

  const handleCreateTag = () => {
    const newTag = searchValue.trim();
    if (newTag !== "" && !selectedTags.includes(newTag)) {
      if (selectedTags.length < 3) {
        setValue("tags", [...selectedTags, newTag]);
        setSearchValue("");
        setOpenCombobox(false);
      } else {
        toast({
          title: "Maximum Tags Reached",
          description: "You can only add up to 3 tags per question.",
          variant: "destructive",
        });
      }
    }
  };

  const handleTagRemove = (tag: string) => {
    setValue(
      "tags",
      selectedTags.filter((t) => t !== tag),
    );
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchValue.trim() !== "") {
      e.preventDefault();
      handleCreateTag();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue={parsedQuestionDetails.content || ""}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | codesample | bold italic forecolor | alignleft aligncenter | alignright alignjustify | bullist numlist",
                    content_style: "body { font-family:Inter; font-size:14px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCombobox}
                      className="w-full justify-between"
                    >
                      {field.value.length > 0
                        ? `${field.value.length} tag${field.value.length > 1 ? "s" : ""} selected`
                        : "Select tags..."}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search tags..."
                      value={searchValue}
                      onValueChange={setSearchValue}
                      onKeyDown={handleInputKeyDown}
                    />
                    <CommandList>
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup>
                        {searchValue.trim() !== "" &&
                          field.value.length < 3 &&
                          !allTags.includes(searchValue.trim()) && (
                            <CommandItem onSelect={handleCreateTag}>
                              <PlusCircle className="mr-2 size-4" />
                              Create &quot;{searchValue}&quot;
                            </CommandItem>
                          )}
                        {allTags
                          .filter((tag) =>
                            tag
                              .toLowerCase()
                              .includes(searchValue.toLowerCase()),
                          )
                          .map((tag) => (
                            <CommandItem
                              key={tag}
                              value={tag}
                              onSelect={() => handleTagSelect(tag)}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.includes(tag)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {tag}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex-start mt-2.5 gap-2.5">
                {field.value.map((tag) => (
                  <Badge
                    key={tag}
                    className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                  >
                    {tag}
                    <X
                      size={12}
                      className="cursor-pointer object-contain"
                      onClick={() => handleTagRemove(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                can select existing tags or create new ones.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "Edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
