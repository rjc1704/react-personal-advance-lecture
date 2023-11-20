import styled from "styled-components";
import Button from "components/common/Button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "redux/modules/authSlice";
import { api } from "api";

export default function Login() {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [inLogin, setInLogin] = useState(true);

  const navigate = useNavigate();

  const handleAuth = async (event) => {
    event.preventDefault();
    // 로그인 상태로 변경
    if (inLogin) {
      // 서버로 로그인 요청 후 성공 시 상태변경
      if (!id || !password) return alert("아이디와 비밀번호는 필수값입니다.");

      const result = await api.post("/login", {
        id,
        password,
      });
      const accessToken = result.data.accessToken;

      if (result.status === 200) {
        dispatch(login(accessToken));
      }
    } else {
      // 회원가입 요청
      if (!id || !password || !nickname)
        return alert("아이디, 비밀번호, 닉네임은 필수값입니다.");

      const result = await api.post("/register", {
        id,
        password,
        nickname,
      });
      if (result?.data.success) {
        // 회원가입 성공 처리
        setInLogin(true);
        return alert("회원가입에 성공했습니다. 로그인 해주세요.");
      }
    }
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);
  return (
    <Container>
      <Form onSubmit={handleAuth}>
        <Title>{inLogin ? "로그인" : "회원가입"}</Title>
        <Input
          placeholder="아이디"
          onChange={(event) => setId(event.target.value)}
          value={id}
        />
        <Input
          placeholder="비밀번호"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        {!inLogin && (
          <Input
            placeholder="닉네임"
            onChange={(event) => setNickname(event.target.value)}
            value={nickname}
          />
        )}
        <Button text={inLogin ? "로그인" : "회원가입"} size="large" />
        <ToggleMenu>
          <span onClick={() => setInLogin((prev) => !prev)}>
            {inLogin ? "회원가입" : "로그인"}
          </span>
        </ToggleMenu>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: lightgray;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 12px 18px;
  border-radius: 12px;
  background-color: white;
  width: 500px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 36px;
`;

const Input = styled.input`
  margin-bottom: 24px;
  padding: 12px 0;
  border: none;
  border-bottom: 1px solid gray;
  outline: none;
`;

const ToggleMenu = styled.div`
  text-align: center;
  font-size: 16px;
  color: lightgray;
  margin-top: 24px;
  & span {
    user-select: none;
    cursor: pointer;
    &:hover {
      color: black;
      font-weight: 700px;
    }
  }
`;
