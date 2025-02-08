import React from "react";
import { useFormikContext } from "formik";
import Select from "./Select";
import { v4 as uuidv4 } from "uuid";

interface DynamicSelectFieldProps {
  name: string;
  label: string;
  optionsFieldName: string;
  minAnswers: number;
}

const DynamicSelectField: React.FC<DynamicSelectFieldProps> = ({
  name,
  label,
  optionsFieldName,
  minAnswers,
}) => {
  const { values, errors, setFieldValue } =
    useFormikContext<Record<string, string | string[]>>();

  const answerOptions: string[] = Array.isArray(values[optionsFieldName])
    ? values[optionsFieldName]
    : [];

  const answerErrors = errors[optionsFieldName];

  const validOptions = answerOptions
    .map((option: string, index: number) => {
      const singleError = Array.isArray(answerErrors)
        ? answerErrors[index]
        : undefined;

      const isValid = !singleError && option.trim() !== "";

      return { option, isValid };
    })
    .filter(({ isValid }) => isValid);

  const selectOptions = validOptions.map(({ option }) => ({
    value: option,
    label: option,
  }));

  const isDisabled = selectOptions.length < minAnswers;

  return (
    <Select
      name={name}
      label={label}
      options={selectOptions}
      readOnly={isDisabled}
      placeholder={`Fill at least ${minAnswers} Answer Options to enable selection`}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setFieldValue(name, e.target.value)
      }
    />
  );
};

export default DynamicSelectField;
