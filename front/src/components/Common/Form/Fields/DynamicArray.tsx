import React from "react";
import { useFormikContext, FieldArray } from "formik";
import Input from "./Input"; // Reuse your existing Input component

interface DynamicArrayFieldProps {
  name: string;
  label: string;
  minItems?: number;
  readOnly?: boolean;
}

const DynamicArrayField: React.FC<DynamicArrayFieldProps> = ({
  name,
  label,
  minItems = 2,
  readOnly = false,
}) => {
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext<Record<string, string | string[]>>();

  const arrayValues = Array.isArray(values[name]) ? (values[name] as string[]) : [];

  const fieldError = errors[name];
  const fieldTouched = touched[name];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <FieldArray
        name={name}
        render={({ push, remove }) => (
          <>
            {arrayValues.map((val: string, index: number) => {
              const fieldName = `${name}.${index}`;

              return (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    name={fieldName}
                    value={val}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    readOnly={readOnly}
                    error={
                      typeof fieldError === "object" && fieldError !== null
                        ? (fieldError as string[])[index]
                        : undefined
                    }
                  />

                  {!readOnly && arrayValues.length > minItems && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            {!readOnly && (
              <button
                type="button"
                onClick={() => push("")}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                + Add Option
              </button>
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
