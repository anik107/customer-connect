"use server";

import { aiOverview } from "@/data/ai-overview";

export const getAiOverview = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!baseUrl) {
      return { data: aiOverview };
    }

    const response = await fetch(`${baseUrl}/ai-overview`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { data: aiOverview };
    }

    const data = await response.json();

    return data?.data ? data : { data: aiOverview };
  } catch (error) {
    return { data: aiOverview, error: error?.message ?? "Unable to load AI overview." };
  }
};
