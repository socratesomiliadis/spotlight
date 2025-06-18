"use server";

import { searchAll } from "./actions";

export async function searchAction(query: string) {
  if (!query || query.trim().length < 2) {
    return {
      users: [],
      projects: [],
    };
  }

  try {
    const results = await searchAll(query.trim());
    return results;
  } catch (error) {
    console.error("Search error:", error);
    return {
      users: [],
      projects: [],
    };
  }
}
