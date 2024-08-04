"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, userId } = params;

    const question = await Question.findById(questionId);

    // Check if this is a new view
    let isNewView = false;

    if (userId) {
      // For logged-in users
      const existingInteraction = await Interaction.findOne({
        user: userId,
        question: questionId,
        action: "view",
      });

      if (!existingInteraction) {
        // This is a new view
        isNewView = true;

        // Create interaction
        await Interaction.create({
          user: userId,
          question: questionId,
          action: "view",
        });
        await User.findByIdAndUpdate(question.author, {
          $inc: { reputation: 1 },
        });
      }
    } else {
      // For anonymous users, we can't track individually
      // So we'll count every view as unique
      isNewView = true;
    }

    if (isNewView) {
      // Update view count for the question only if it's a new view
      await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}