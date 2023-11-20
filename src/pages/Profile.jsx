import Avatar from "components/common/Avatar";
import { useEffect, useState } from "react";
import styled from "styled-components";
import heic2any from "heic2any";
import { authApi } from "api";
import Button from "components/common/Button";

export default function Profile() {
  const [imgFile, setImgFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [nickname, setNickname] = useState("");
  const [editingNickname, setEditingNickname] = useState("");
  const [id, setId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
      setImgUrl(imageUrl);
    } else {
      const objUrl = URL.createObjectURL(file);
      setImgUrl(objUrl);
    }
  };

  const getProfile = async () => {
    try {
      const {
        data: { id, nickname, avatar },
      } = await authApi.get("/user");
      setId(id);
      setNickname(nickname);
      setImgUrl(avatar);
    } catch (error) {
      console.error(error);
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

    await authApi.post("/profile", formData, { isFile: true });

    getProfile();

    setIsEditing(false);
    setEditingNickname("");
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <Container>
      <ProfileWrapper>
        <h1>프로필 관리</h1>
        <label>
          <Avatar src={imgUrl} size="large" id="imgInput" />
          <input onChange={previewImg} type="file" accept="image/*" />
        </label>
        {isEditing ? (
          <input
            name="editing"
            autoFocus
            defaultValue={nickname}
            onChange={(event) => setEditingNickname(event.target.value)}
          />
        ) : (
          <Nickname>{nickname}</Nickname>
        )}

        <Id>{id}</Id>
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
