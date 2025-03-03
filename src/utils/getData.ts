import axios from "axios";
import type { FetchedResource } from "@typos/types";

export const getData = async (url: string): Promise<FetchedResource> => {
  try {
    const response = await axios.get(url);
    const slug = new URL(url).pathname.split("/").filter(Boolean).pop() || "";

    return {
      id: Date.now().toString(),
      html: response.data,
      slug,
      url,
    };
  } catch (error) {
    throw error;
  }
};
