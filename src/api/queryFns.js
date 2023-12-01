import { jsonApi } from "api";

export const getLetters = async () => {
  const { data } = await jsonApi.get("/letters?_sort=createdAt&_order=desc");
  return data;
};
