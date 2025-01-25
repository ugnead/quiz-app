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

  let validAnswersCount = 0;
  const selectOptions = answerOptions.map((option: string, index: number) => {
    const singleError = Array.isArray(answerErrors)
      ? answerErrors[index]
      : undefined;

    const isValid = !singleError && option.trim() !== "";
    if (isValid) validAnswersCount++;

    return {
      value: option,
      label: option || "Empty Option",
    };
  });

  const isDisabled = validAnswersCount < minAnswers;

  return (
    <Select
      name={name}
      label={label}
      options={selectOptions}
      readOnly={isDisabled}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setFieldValue(name, e.target.value)
      }
    />
  );
};

export default DynamicSelectField;
