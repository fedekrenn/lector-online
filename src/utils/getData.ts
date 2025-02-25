import axios from "axios";

export const getData = async (url: string) => {
  const response = await axios.get(url);

  return response.data;
};
