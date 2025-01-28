import React from "react";
import { useFormikContext, FieldArray } from "formik";

import Input from "./Input";
import Button from "../../Button";

import { FiMinusCircle } from "react-icons/fi";

interface DynamicArrayFieldProps {
  name: string;
  label: string;
  minItems?: number;
  maxItems?: number;
  readOnly?: boolean;
}

const DynamicArrayField: React.FC<DynamicArrayFieldProps> = ({
  name,
  label,
  minItems = 2,
  maxItems = 5,
  readOnly = false,
}) => {
  const { values, errors, touched } =
    useFormikContext<Record<string, string | string[]>>();

  const arrayValues: string[] = Array.isArray(values[name]) ? values[name] : [];

  const fieldError = errors[name];
  const fieldTouched = touched[name];

  const isDisabled = arrayValues.length >= maxItems;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <>
            {arrayValues.map((_, index) => {
              const fieldName = `${name}.${index}`;
              return (
                <div key={index} className="relative group">
                  <Input name={fieldName} readOnly={readOnly} />

                  {!readOnly && arrayValues.length > minItems && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute left-0 top-3 transform -translate-x-2.5 md:-translate-x-7 bg-white"
                      title="Remove Option"
                    >
                      <FiMinusCircle className="text-gray-500 h-5 w-5" />
                    </button>
                  )}
                </div>
              );
            })}
            {!readOnly && (
              <Button
                type="button"
                onClick={() => push("")}
                disabled={isDisabled}
                fullWidth
              >
                {isDisabled ? "Max Options Reached" : "Add Option"}
              </Button>
            )}
            {fieldTouched && typeof fieldError === "string" && (
              <p className="text-red-600 text-sm mt-1">{fieldError}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default DynamicArrayField;
