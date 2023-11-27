import Avatar from "components/common/Avatar";
import { useState } from "react";
import styled from "styled-components";
import heic2any from "heic2any";
import { jsonApi } from "api";
import Button from "components/common/Button";
import { useDispatch } from "react-redux";
import { setProfile } from "redux/modules/authSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "api/queryFns";
import { editProfile } from "api/mutateFns";

export default function Profile() {
  const dispatch = useDispatch();
  const [imgFile, setImgFile] = useState(null);
  const [editingNickname, setEditingNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const {
    data: profileData,
    refetch: refetchProfile,
    isLoading,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { mutate: mutateToEditProfile } = useMutation({
    mutationFn: editProfile,
    onSuccess: async (data) => {
      const newProfile = { ...data };
      delete newProfile.message;
      delete newProfile.success;
      dispatch(setProfile(newProfile));
      refetchProfile();

      // db.json에도 프로필 변경사항 반영
      const { data: myLetters } = await jsonApi.get(
        `/letters?userId=${localStorage.getItem("userId")}`,
        newProfile
      );
      if (myLetters.length > 0) {
        const letterIds = myLetters.map((letter) => letter.id);
        for (const letterId of letterIds) {
          await jsonApi.patch(`/letters/${letterId}`, newProfile);
        }
      }

      setIsEditing(false);
      setEditingNickname("");
    },
  });

  const previewImg = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return alert("파일 사이즈는 최대 5MB 까지 허용합니다.");
    }

    setImgFile(file);

    // Preview 를 위한 로직
    if (file.type === "image/heic") {
      const blob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.5, // 변환 품질 설정
      });

      const imageUrl = URL.createObjectURL(blob);

      queryClient.setQueryData(["profile"], (prev) => ({
        ...prev,
        avatar: imageUrl,
      }));
    } else {
      const objUrl = URL.createObjectURL(file);
      queryClient.setQueryData(["profile"], (prev) => ({
        ...prev,
        avatar: objUrl,
      }));
    }
  };

  const onEditDone = async () => {
    const answer = window.confirm("이대로 수정하시겠습니까?");
    if (!answer) return;

    const formData = new FormData();
    if (imgFile) {
      formData.append("avatar", imgFile);
    }
    if (editingNickname) {
      formData.append("nickname", editingNickname);
    }
    await mutateToEditProfile(formData);
  };

  if (isLoading) {
    return <p>로딩중...</p>;
  }
  return (
    <Container>
      <ProfileWrapper>
        <h1>프로필 관리</h1>
        <label>
          <Avatar src={profileData.avatar} size="large" id="imgInput" />
          <input onChange={previewImg} type="file" accept="image/*" />
        </label>
        {isEditing ? (
          <input
            name="editing"
            maxLength={10}
            placeholder="최대 10글자 가능"
            autoFocus
            defaultValue={profileData.nickname}
            onChange={(event) => setEditingNickname(event.target.value)}
          />
        ) : (
          <Nickname>{profileData.nickname}</Nickname>
        )}

        <Id>{profileData.id}</Id>
        <BtnsWrapper>
          {isEditing ? (
            <>
              <Button text="취소" onClick={() => setIsEditing(false)} />
              <Button
                text="수정완료"
                onClick={onEditDone}
                disabled={!editingNickname && !imgFile}
              />
            </>
          ) : (
            <Button text="수정하기" onClick={() => setIsEditing(true)} />
          )}
        </BtnsWrapper>
      </ProfileWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ProfileWrapper = styled.main`
  width: 500px;
  background-color: lightgray;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  border-radius: 12px;

  & h1 {
    font-size: 36px;
    font-weight: 700;
  }

  & input[type="file"] {
    display: none;
  }

  & input[name="editing"] {
    outline: none;
    padding: 12px;
  }
`;

const Nickname = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const Id = styled.span`
  font-size: 18px;
  color: gray;
`;

const BtnsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
