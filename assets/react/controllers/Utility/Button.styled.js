import styled from "styled-components";

export const PrimaryButton = styled.button`
  background-color: ${({ theme, variant }) =>
    variant === "dark" ? theme.colors.dark : theme.colors.light};
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  font-size: medium;
  border: 3px solid
    ${({ theme, variant }) =>
      variant === "dark" ? theme.colors.dark : theme.colors.neutral};
  border-radius: 0.5rem;
  padding: 10px 20px;
  margin: auto 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral};
  }
`;

export const SecondaryButton = styled.button`
  background-color: #21d19f;
  color: #002626;
  font-weight: normal;
  font-size: small;
`;
