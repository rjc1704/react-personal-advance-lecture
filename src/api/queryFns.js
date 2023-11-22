import axios from "axios";

export const getLettersFromDB = async () => {
  const { data: letters } = await axios.get(
    "http://localhost:5000/letters?_sort=createdAt&_order=desc"
  );
  return letters;
};
