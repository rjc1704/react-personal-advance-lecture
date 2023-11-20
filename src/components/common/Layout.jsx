import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "redux/modules/authSlice";
import { __getLetters } from "redux/modules/letterSlice";
import styled from "styled-components";

export default function Layout() {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(__getLetters());
  }, [dispatch]);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);
  return (
    <>
      <Nav>
        <div onClick={() => navigate("/")}>HOME</div>
        <section>
          <div onClick={() => navigate("/profile")}>내 프로필</div>
          <div onClick={() => dispatch(logout())}>로그아웃</div>
        </section>
      </Nav>
      <Outlet />
    </>
  );
}

const Nav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  background-color: gray;
  padding: 12px 24px;
  & div {
    cursor: pointer;
    &:hover {
      color: yellow;
      font-weight: 700;
    }
  }
  & section {
    display: flex;
    gap: 12px;
  }
`;
