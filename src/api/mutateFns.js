import { authApi, jsonApi } from "api";

export const addLetter = (newLetter) => jsonApi.post("/letters", newLetter);

export const editLetter = ({ id, editingText }) =>
  jsonApi.patch(`/letters/${id}`, { content: editingText });

export const deleteLetter = (id) => jsonApi.delete(`/letters/${id}`);

export const signUp = ({ id, password, nickname }) =>
  authApi.post("/register", {
    id,
    password,
    nickname,
  });

export const signIn = async ({ id, password }) => {
  const { data } = await authApi.post("/login", {
    id,
    password,
  });

  return data;
};

export const editProfile = async (formData) => {
  const { data } = await authApi.post("/profile", formData, { isFile: true });
  return data;
};
