import styled, { css } from "styled-components";
import defaultUser from "assets/defaultUser.png";

export default function Avatar({ src, size }) {
  return (
    <AvatarFigure size={size}>
      <img src={src ?? defaultUser} alt="아바타이미지" />
    </AvatarFigure>
  );
}

const AvatarFigure = styled.figure`
  ${(props) => {
    switch (props.size) {
      case "large":
        return css`
          width: 75px;
          height: 75px;
        `;
      default:
        return css`
          width: 50px;
          height: 50px;
        `;
    }
  }}

  border-radius: 50%;
  overflow: hidden;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;
