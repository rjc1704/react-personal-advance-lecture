import styled from "styled-components";
import { useSelector } from "react-redux";
import LetterCard from "./LetterCard";
import { useQuery } from "@tanstack/react-query";
import { getLettersFromDB } from "api/queryFns";

export default function LetterList() {
  const activeMember = useSelector((state) => state.member);

  const { data: letters, isLoading } = useQuery({
    queryKey: ["letters"],
    queryFn: getLettersFromDB,
  });

  const filteredLetters = letters?.filter(
    (letter) => letter.writedTo === activeMember
  );

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  return (
    <ListWrapper>
      {filteredLetters.length === 0 ? (
        <p>
          {activeMember}에게 남겨진 팬레터가 없습니다. 첫 번째 팬레터의 주인공이
          되보세요!
        </p>
      ) : (
        filteredLetters.map((letter) => (
          <LetterCard key={letter.id} letter={letter} />
        ))
      )}
    </ListWrapper>
  );
}

const ListWrapper = styled.ul`
  background-color: black;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 500px;
  border-radius: 12px;
  padding: 12px;
  color: white;
`;
