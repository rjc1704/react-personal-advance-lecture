import styled, { css } from "styled-components";

export default function Button({
  text,
  onClick = () => {},
  size = "small",
  disabled = null,
}) {
  return (
    <BtnWrapper size={size}>
      <button disabled={disabled} onClick={onClick}>
        {text}
      </button>
    </BtnWrapper>
  );
}

const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  & button {
    background-color: black;
    color: white;
    font-size: 16px;
    &:disabled {
      background-color: lightgray;
    }

    cursor: pointer;
    ${(props) => {
      switch (props.size) {
        case "large":
          return css`
            width: 100%;
            font-size: 20px;
            padding: 24px 36px;
          `;
        default:
          return css`
            width: auto;
            padding: 6px 12px;
          `;
      }
    }}
  }
`;
