"use server";

import { bankData } from "@/data/bankData";
import { regionwisePost } from "@/data/regionwisePost";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

const buildApiUrl = (path) => {
  if (!API_BASE_URL) {
    return null;
  }

  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
};

export const getBankMentions = async () => {
  try {
    const url = buildApiUrl("/bank-mentions");

    if (!url) {
      return { data: bankData.data };
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { data: bankData.data };
    }
    const data = await response.json();

    return data?.data ? data : { data: bankData.data };
  } catch (error) {
    return { data: bankData.data };
  }
};

export const getGeolocation = async () => {
  try {
    const url = buildApiUrl("/geolocation");

    if (!url) {
      return { data: regionwisePost.data };
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { data: regionwisePost.data };
    }

    const data = await response.json();

    return data?.data ? data : { data: regionwisePost.data };
  } catch (error) {
    return { data: regionwisePost.data };
  }
};
