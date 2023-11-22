import { authApi, jsonApi } from "api";

export const getLettersFromDB = async () => {
  const { data: letters } = await jsonApi.get(
    "/letters?_sort=createdAt&_order=desc"
  );
  return letters;
};

export const getProfile = async () => {
  const { data } = await authApi.get("/user");
  return data;
};
