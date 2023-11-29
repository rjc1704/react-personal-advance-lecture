import Button from "components/common/Button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "redux/modules/authSlice";
import styled from "styled-components";
import { toast } from "react-toastify";
import useForm from "hooks/useForm";
import { authApi } from "api";

export default function Login() {
  const dispatch = useDispatch();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { formState, onChangeHandler, resetForm } = useForm({
    id: "",
    password: "",
    nickname: "",
  });
  const { id, password, nickname } = formState;

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      // 로그인 처리
      try {
        const { data } = await authApi.post("/login", {
          id,
          password,
        });
        if (data.success) {
          dispatch(login(data.accessToken));
          toast.success("로그인 성공");
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else {
      // 회원가입 처리
      try {
        const { data } = await authApi.post("/register", {
          id,
          password,
          nickname,
        });
        if (data.success) {
          setIsLoginMode(true);
          resetForm();
          toast.success("회원가입 성공");
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    }
  };

  return (
    <Container>
      <Form onSubmit={onSubmitHandler}>
        <Title>{isLoginMode ? "로그인" : "회원가입"}</Title>
        <Input
          name="id"
          onChange={onChangeHandler}
          value={id}
          placeholder="아이디 (4~10글자)"
          minLength={4}
          maxLength={10}
        />
        <Input
          name="password"
          onChange={onChangeHandler}
          value={password}
          placeholder="비밀번호 (4~15글자)"
          minLength={4}
          maxLength={15}
        />
        {!isLoginMode && (
          <Input
            name="nickname"
            value={nickname}
            onChange={onChangeHandler}
            placeholder="닉네임 (1~10글자)"
            minLength={1}
            maxLength={10}
          />
        )}
        <Button
          disabled={
            isLoginMode ? !id || !password : !id || !password || !nickname
          }
          text={isLoginMode ? "로그인" : "회원가입"}
          size="large"
        />
        <ToggleText>
          <span onClick={() => setIsLoginMode((prev) => !prev)}>
            {isLoginMode ? "회원가입" : "로그인"}
          </span>
        </ToggleText>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  background-color: lightgray;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  background-color: white;
  width: 500px;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid gray;
  width: 100%;
  display: block;
  margin-bottom: 16px;
  padding: 12px 0;
  outline: none;
`;

const ToggleText = styled.div`
  text-align: center;
  width: 100%;
  margin-top: 24px;
  & span {
    color: lightgray;
    user-select: none;
    cursor: pointer;
    &:hover {
      color: black;
    }
  }
`;
