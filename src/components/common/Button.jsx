import styled, { css } from "styled-components";

export default function Button({
  text,
  size = "small",
  onClick = () => {},
  disabled = false,
}) {
  return (
    <BtnWrapper size={size} disabled={disabled}>
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
    ${(props) => {
      if (props.disabled) {
        return css`
          background-color: lightgray;
        `;
      }
      return css`
        background-color: black;
      `;
    }}

    color: white;
    font-size: 16px;
    cursor: pointer;

    ${(props) => {
      if (props.size === "large") {
        return css`
          padding: 12px 18px;
          width: 100%;
        `;
      }
      return css`
        padding: 6px 12px;
        width: auto;
      `;
    }}
  }
`;
