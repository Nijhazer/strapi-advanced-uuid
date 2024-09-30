import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { ArrowClockwise } from "@strapi/icons";
import { v4, validate } from "uuid";
import { Field } from "@strapi/design-system";
import { generateUUID, validateUUID } from "../../utils/helpers";

export const FieldActionStyling = styled.div`
  svg {
    path {
      fill: ${({ theme }) => theme.colors.neutral400};
    }
  }

  svg:hover {
    path {
      fill: ${({ theme }) => theme.colors.primary600};
    }
  }
`;

const Input = ({
  attribute,
  description,
  placeholder,
  disabled,
  error,
  label,
  name,
  onChange,
  value: initialValue = "",
}: {
  attribute: any;
  description: any;
  placeholder: string;
  disabled: boolean;
  error: boolean;
  label: any;
  name: string;
  onChange(v: any): void;
  value: string;
}) => {
  const { formatMessage } = useIntl();
  const [invalidUUID, setInvalidUUID] = useState<boolean>(false);
  const ref = useRef("");

  const getUUIDFormat = () => {
    if (attribute.options && attribute.options["uuid-format"]) {
      return attribute.options["uuid-format"];
    }
    return null;
  };

  const getRegenerateOption = () => {
    if (attribute.options && attribute.options["disable-regenerate"]) {
      return attribute.options["disable-regenerate"];
    }
    return false;
  };

  const generateNewUUID = () => {
    const uuidFormat = getUUIDFormat();
    return uuidFormat ? generateUUID(uuidFormat) : v4();
  };

  useEffect(() => {
    const uuidFormat = getUUIDFormat();
    if (!initialValue) {
      const newUUID = generateNewUUID();
      onChange({ target: { value: newUUID, name } });
    }

    if (initialValue && initialValue !== ref.current)
      ref.current = initialValue;
    const validateValue = uuidFormat
      ? validateUUID(uuidFormat, initialValue)
      : validate(initialValue);
    if (!validateValue) return setInvalidUUID(true);
    setInvalidUUID(false);
  }, [initialValue, attribute]);

  return (
    <Field.Root
      id={name}
      name={name}
      hint={description && formatMessage(description)}
      error={
        error ??
          (invalidUUID
            ? formatMessage({
              id: "uuid.form.field.error",
              defaultMessage: "The UUID format is invalid.",
            })
          : null)
      }
    >
      <Field.Label>{label}</Field.Label>
      <Field.Input
        type="text"
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled || true}
        required
        value={initialValue}
        ref={ref}
        endAction={
          !getRegenerateOption() && (
            <FieldActionStyling>
              <Field.Action
                onClick={() => {
                  const newUUID = generateNewUUID();
                  onChange({ target: { value: newUUID, name } });
                }}
                label={formatMessage({
                  id: "uuid.form.field.generate",
                  defaultMessage: "Generate",
                })}
              >
                <ArrowClockwise />
              </Field.Action>
            </FieldActionStyling>
          )
        }
      />
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};

export default Input;
