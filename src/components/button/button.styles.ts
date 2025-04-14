import styled, { css } from "styled-components";

interface ButtonProps {
  $variant:
    | "primary"
    | "secondary"
    | "danger"
    | "disabled"
    | "ghost"
    | "active"
    | "dental"
    | "dental-active"
    | "approve-dar";
  $size: "small" | "medium" | "large";
  $hasIcon: boolean;
  $hasText: boolean;
  $isIconOnly: boolean;
  $disableHover: boolean;
}

interface IconProps {
  $withText: boolean;
  $variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "disabled"
    | "ghost"
    | "active"
    | "dental"
    | "dental-active"
    | "approve-dar";
}

export const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid var(--border-primary-light);
  border-radius: var(--radius-md);
  font-size: var(--font-size-text-sm);
  line-height: var(--line-height-text-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary-light);
  background-color: transparent;

  ${(props) =>
    props.$isIconOnly &&
    css`
      padding: 10px;
    `}

  ${(props) =>
    props.$variant === "primary" &&
    css`
      box-shadow: 0px -2px 0px 0px #0a0d120d inset;
    `}

  ${(props) =>
    props.$variant === "secondary" &&
    css`
      background-color: var(--border-brand-light);
      border: 2px solid var(--button-secondary-border);
      color: var(--white);

      &:disabled {
        background-color: var(--gray-iron-300);
        border-color: var(--gray-iron-300);
        color: var(--gray-iron-500);
        opacity: 1;
      }
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${(props) =>
    props.$variant === "disabled" &&
    css`
      background-color: var(--border-secondary);
      border: 2px solid var(--border-secondary);
      cursor: not-allowed;
    `}

  ${(props) =>
    props.$variant === "ghost" &&
    css`
      background-color: transparent;
      border: none;
      padding: 8px;
    `}

  ${(props) =>
    props.$variant === "danger" &&
    css`
      background-color: var(--error-600);
      color: var(--white);
    `}

  ${(props) =>
    props.$variant === "active" &&
    css`
      background-color: #f0e5fd;
      border: 1px solid var(--purple-brand-primary);
    `}

  ${(props) =>
    props.$variant === "dental" &&
    css`
      padding: 0 !important;
    `}

  ${(props) =>
    props.$variant === "dental-active" &&
    css`
      padding: 0 !important;
      border: 1px solid var(--purple-brand-primary);
    `}

  ${(props) =>
    props.$variant === "approve-dar" &&
    css`
      background-color: var(--success-700);
      color: var(--white);
      border: none;
    `}

  ${(props) =>
    props.$size === "small" &&
    css`
      padding: 11px;
      min-width: 40px;
      min-height: 40px;
    `}

  ${(props) =>
    props.$size === "medium" &&
    css`
      padding: 10px 16px;
    `}

  ${(props) =>
    props.$size === "large" &&
    css`
      padding: 10px 14px;
    `}

  ${(props) =>
    props.$disableHover &&
    css`
      &:hover {
        border: 2px solid var(--button-secondary-border);
        cursor: auto;
      }
    `}
`;

export const IconImage = styled.img<IconProps>`
  display: inline-flex;
  object-fit: contain;
  margin-right: ${(props) => (props.$withText ? "8px" : "0")};
  ${(props) =>
    props.$variant === "active" &&
    css`
      filter: brightness(0) saturate(100%) invert(71%) sepia(11%)
        saturate(1095%) hue-rotate(223deg) brightness(87%) contrast(87%);
    `}
`;

export const RightIconImage = styled.img<IconProps>`
  display: inline-flex;
  object-fit: contain;
  margin-left: ${(props) => (props.$withText ? "8px" : "0")};
  ${(props) =>
    props.$variant === "active" &&
    css`
      filter: brightness(0) saturate(100%) invert(71%) sepia(11%)
        saturate(1095%) hue-rotate(223deg) brightness(87%) contrast(87%);
    `}
`;

export const TextSpan = styled.span`
  display: inline-flex;
`;
