import React from "react";
import { useFormikContext } from "formik";
import Select from "./Select";
import { v4 as uuidv4 } from "uuid";

interface DynamicSelectFieldProps {
  name: string;
  label: string;
  optionsFieldName: string;
  minAnswers;
}

const DynamicSelectField: React.FC<DynamicSelectFieldProps> = ({
  name,
  label,
  optionsFieldName,
  minAnswers,
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  const answerOptions = Array.isArray(values[optionsFieldName])
    ? values[optionsFieldName]
    : [];

  const selectOptions =
    answerOptions.length >= 2
      ? answerOptions.map((option: string) => ({
        value: String(option || uuidv4()),
        label: String(option || "Empty Option"),
        }))
      : [];

  const isDisabled = selectOptions.length < minAnswers;

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
