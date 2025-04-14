import React from "react";
import { StyledButton, IconImage, TextSpan, RightIconImage } from "./button.styles";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  rightIcon?: string;
  alt?: string;
  rightAlt?: string;
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "disabled"
    | "ghost"
    | "active"
    | "dental"
    | "dental-active"
    | "approve-dar";
  size?: "small" | "medium" | "large";
  disableHover?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  rightIcon,
  alt = "",
  rightAlt = "",
  children,
  className,
  variant = "primary",
  size = "medium",
  disableHover = false,
  ...rest
}) => {
  const hasLeftIcon = Boolean(icon);
  const hasRightIcon = Boolean(rightIcon);
  const hasChildren = Boolean(children);
  const isIconOnly = (hasLeftIcon || hasRightIcon) && !hasChildren;

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $hasIcon={hasLeftIcon || hasRightIcon}
      $hasText={hasChildren}
      $isIconOnly={isIconOnly}
      $disableHover={disableHover}
      className={className}
      {...rest}
    >
      {hasLeftIcon && <IconImage src={icon} alt={alt} $withText={hasChildren} $variant={variant} />}
      {hasChildren && <TextSpan>{children}</TextSpan>}
      {hasRightIcon && (
        <RightIconImage src={rightIcon} alt={rightAlt} $withText={hasChildren} $variant={variant} />
      )}
    </StyledButton>
  );
};

export default Button;
