"use server";

export const getActionItems = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/action-items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
