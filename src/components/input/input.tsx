import { Field, ErrorMessage } from "formik";
import {
  FormGroup,
  FormLabel,
  FormInput,
  StyledField,
  ErrorText,
  RequiredAsterisk,
} from "./input.styles";

interface IInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  numericOnly?: boolean;
  horizontal?: boolean;
  style?: React.CSSProperties;
  countryCode?: string;
}

export default function Input({
  id,
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  numericOnly = false,
  horizontal = false,
  style,
  countryCode,
}: Readonly<IInputProps>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, form: any) => {
    if (numericOnly) {
      const numericValue = e.target.value.replace(/[^0-9]/g, "");
      form.setFieldValue(name, numericValue);
    } else {
      form.handleChange(e);
    }
  };

  return (
    <FormGroup $horizontal={horizontal}>
      <FormLabel htmlFor={id} $horizontal={horizontal}>
        {label} {required && <RequiredAsterisk>*</RequiredAsterisk>}
      </FormLabel>
      <FormInput $horizontal={horizontal} style={style}>
        <Field name={name}>
          {({ field, form }: any) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {countryCode && (
                <span style={{ whiteSpace: "nowrap", marginRight: "8px" }}>
                  {countryCode}
                </span>
              )}
              <StyledField
                {...field}
                id={id}
                type={type}
                placeholder={placeholder}
                spellCheck="false"
                autoComplete="off"
                data-form-type="other"
                $horizontal={horizontal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e, form)
                }
              />
            </div>
          )}
        </Field>
        <ErrorMessage name={name} component={ErrorText} />
      </FormInput>
    </FormGroup>
  );
}
