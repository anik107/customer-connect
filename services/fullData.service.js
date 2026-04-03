"use server";

export const getAllPosts = async (page) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/full-data/posts/${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data?.data;
  } catch (error) {
    throw error;
  }
};

export const getAllComments = async (page) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/full-data/comments/${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data?.data;
  } catch (error) {
    throw error;
  }
};
