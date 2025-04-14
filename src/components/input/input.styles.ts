import styled, { css } from "styled-components";

interface FormGroupProps {
  $horizontal?: boolean;
}

interface FormLabelProps {
  $horizontal?: boolean;
}

interface FormInputProps {
  $horizontal?: boolean;
}

interface StyledFieldProps {
  $horizontal?: boolean;
}

export const FormGroup = styled.div<FormGroupProps>`
  display: flex;
  flex-direction: ${({ $horizontal }) => ($horizontal ? "row" : "column")};
  align-items: ${({ $horizontal }) => ($horizontal ? "center" : "flex-start")};
  width: 100%;
  height: calc(
    var(--font-size-text-sm) * var(--line-height-text-sm) + 6px + var(--font-size-text-md) *
      var(--line-height-text-md) + var(--spacing-md) * 2 + var(--font-size-text-sm) *
      var(--line-height-text-sm)
  );
  margin-top: 4px;
  gap: ${({ $horizontal }) => ($horizontal ? "var(--spacing-md)" : "0")};
`;

export const FormLabel = styled.label<FormLabelProps>`
  font-size: var(--font-size-text-sm);
  line-height: var(--line-height-text-sm);
  color: var(--text-primary-light);
  font-weight: var(--font-weight-semibold);
  margin-bottom: ${({ $horizontal }) => ($horizontal ? "0" : "6px")};
  ${({ $horizontal }) =>
    $horizontal &&
    css`
      width: 200px;
      min-width: 200px;
      padding-right: var(--spacing-md);
    `}
`;

export const FormInput = styled.div<FormInputProps>`
  width: 100%;
  ${({ $horizontal }) =>
    $horizontal &&
    css`
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    `}
`;

export const StyledField = styled.input<StyledFieldProps>`
  border: 1px solid var(--border-secondary-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  font-size: var(--font-size-text-md);
  width: ${({ $horizontal }) => ($horizontal ? "calc(62% - 16px)" : "100%")};
  box-sizing: border-box;
  background-color: var(--bg-primary-light);
  color: var(--text-primary-light);
  transition: border-color 0.3s ease;
  font-weight: var(--font-weight-regular);

  &:focus {
    border-color: var(--border-brand-light);
    outline: none;
  }

  &::placeholder {
    color: var(--text-placeholder-light);
    font-weight: var(--font-weight-regular);
  }
`;

export const ErrorContainer = styled.div`
  width: 100%;
  height: calc(var(--font-size-text-sm) * var(--line-height-text-sm));
  margin-top: var(--spacing-xs);
`;

export const ErrorText = styled.div`
  color: var(--text-error-primary-light);
  font-size: var(--font-size-text-sm);
  line-height: var(--line-height-text-sm);
  text-align: left;
`;

export const RequiredAsterisk = styled.span`
  color: var(--text-error-primary-light);
  margin-left: 2px;
`;
