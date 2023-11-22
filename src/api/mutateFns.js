import axios from "axios";

export const addLetter = (newLetter) =>
  axios.post("http://localhost:5000/letters", newLetter);

export const editLetter = ({ id, editingText }) =>
  axios.patch(`http://localhost:5000/letters/${id}`, { content: editingText });
export const deleteLetter = (id) =>
  axios.delete(`http://localhost:5000/letters/${id}`);
