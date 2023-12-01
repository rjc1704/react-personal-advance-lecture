import { jsonApi } from "api";

export const addLetter = (newLetter) => jsonApi.post("/letters", newLetter);

export const deleteLetter = (id) => jsonApi.delete(`/letters/${id}`);

export const editLetter = ({ id, editingText }) =>
  jsonApi.patch(`/letters/${id}`, { content: editingText });
