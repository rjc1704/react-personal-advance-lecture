import Avatar from "components/common/Avatar";
import Button from "components/common/Button";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getFormattedDate } from "util/date";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLettersFromDB } from "api/queryFns";
import { deleteLetter, editLetter } from "api/mutateFns";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Detail() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState("");
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const { id } = useParams();

  const queryClient = useQueryClient();
  const { mutate: mutateToDelete } = useMutation({
    mutationFn: deleteLetter,
    onSuccess: () => {
      queryClient.invalidateQueries(["letters"]);
      navigate("/");
    },
  });
  const { mutate: mutateToEdit } = useMutation({
    mutationFn: editLetter,
    onSuccess: () => {
      queryClient.invalidateQueries(["letters"]);
      setIsEditing(false);
      setEditingText("");
    },
  });
  const { data: detailData, isLoading } = useQuery({
    queryKey: ["letters"],
    queryFn: getLettersFromDB,
    select: (letters) => {
      return letters.find((letter) => letter.id === id);
    },
  });

  const onDeleteBtn = () => {
    const answer = window.confirm("정말로 삭제하시겠습니까?");
    if (!answer) return;
    mutateToDelete(id);
  };
  const onEditDone = () => {
    if (!editingText) return toast.warn("수정사항이 없습니다.");

    mutateToEdit({ id, editingText });
  };

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  const isMyLetter = detailData.userId === userId;

  return (
    <Container>
      <Link to="/">
        <HomeBtn>
          <Button text="홈으로" />
        </HomeBtn>
      </Link>

      <DetailWrapper>
        <UserInfo>
          <AvatarAndNickname>
            <Avatar src={detailData?.avatar} size="large" />
            <Nickname>{detailData?.nickname}</Nickname>
          </AvatarAndNickname>
          <time>{getFormattedDate(detailData?.createdAt)}</time>
        </UserInfo>
        <ToMember>To: {detailData?.writedTo}</ToMember>
        {isEditing ? (
          <>
            <Textarea
              autoFocus
              defaultValue={detailData?.content}
              onChange={(event) => setEditingText(event.target.value)}
            />
            <BtnsWrapper>
              <Button text="취소" onClick={() => setIsEditing(false)} />
              <Button text="수정완료" onClick={onEditDone} />
            </BtnsWrapper>
          </>
        ) : (
          <>
            <Content>{detailData?.content}</Content>
            {isMyLetter && (
              <BtnsWrapper>
                <Button text="수정" onClick={() => setIsEditing(true)} />
                <Button text="삭제" onClick={onDeleteBtn} />
              </BtnsWrapper>
            )}
          </>
        )}
      </DetailWrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const HomeBtn = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;

const DetailWrapper = styled.section`
  background-color: gray;
  color: white;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 700px;
  min-height: 400px;
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AvatarAndNickname = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Nickname = styled.span`
  font-size: 32px;
`;

const ToMember = styled.span`
  font-size: 24px;
`;

const Content = styled.p`
  font-size: 24px;
  line-height: 30px;
  padding: 12px;
  background-color: black;
  border-radius: 12px;
  height: 200px;
`;

const BtnsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Textarea = styled.textarea`
  font-size: 24px;
  line-height: 30px;
  padding: 12px;
  background-color: black;
  border-radius: 12px;
  height: 200px;
  resize: none;
  color: white;
`;
