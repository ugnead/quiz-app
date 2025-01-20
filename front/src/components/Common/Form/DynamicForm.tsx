import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "./Fields/Input";
import Select from "./Fields/Select";
import Textarea from "./Fields/Textarea";
import DynamicArrayField from "./Fields/DynamicArray";
import Button from "../Button";

export interface FieldSchema {
  name: string;
  label: string;
  type:
    | "text"
    | "select"
    | "email"
    | "password"
    | "textarea"
    | "dynamicArray";
  options?: { value: string; label: string }[];
  validation?: {
    required?: boolean | ((formMode: "create" | "update") => boolean);
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    minItems?: number;
  };
  readOnly?: boolean | ((formMode: "create" | "update") => boolean);
}

interface DynamicFormProps {
  schema: FieldSchema[];
  initialValues?: Record<string, string | string[]>;
  onSubmit: (values: Record<string, string | string[]>) => void;
  formMode?: "create" | "update";
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  formMode = "create",
}) => {
  const validationSchema = schema.reduce(
    (acc, field) => {
      if (field.type === "dynamicArray") {
        let arrayValidator = Yup.array()
          .of(Yup.string().required("Option cannot be empty"))
          .min(
            field.validation?.minItems || 2,
            `At least ${field.validation?.minItems || 2} options required`
          );
        if (field.validation?.required) {
          const isRequired =
            typeof field.validation.required === "function"
              ? field.validation.required(formMode)
              : field.validation.required;
          if (isRequired) {
            arrayValidator = arrayValidator.required("This field is required");
          }
        }
        acc[field.name] = arrayValidator;
      } else {
        let validator = Yup.string();
        if (field.validation) {
          const isRequired =
            typeof field.validation.required === "function"
              ? field.validation.required(formMode)
              : field.validation.required;
          if (isRequired) {
            validator = validator.required("This field is required");
          }
          if (field.validation.minLength) {
            validator = validator.min(
              field.validation.minLength,
              `Minimum ${field.validation.minLength} characters`
            );
          }
          if (field.validation.maxLength) {
            validator = validator.max(
              field.validation.maxLength,
              `Maximum ${field.validation.maxLength} characters`
            );
          }
          if (field.validation.pattern) {
            validator = validator.matches(
              field.validation.pattern,
              "Invalid format"
            );
          }
        }
        acc[field.name] = validator;
      }
      return acc;
    },
    {} as Record<string, Yup.AnySchema>
  );

  const filteredSchema =
    formMode === "create"
      ? schema.filter((field) => field.name !== "id")
      : schema;

  const formikInitialValues = filteredSchema.reduce(
    (acc, field) => {
      if (field.type === "dynamicArray") {
        acc[field.name] = initialValues[field.name] ?? ["", ""];
      } else {
        acc[field.name] = initialValues[field.name] ?? "";
      }
      return acc;
    },
    {} as Record<string, string | string[]>
  );

  return (
    <Formik
      initialValues={formikInitialValues}
      validationSchema={Yup.object(validationSchema)}
      validateOnChange={false}
      validateOnBlur={true}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form autoComplete="off" onSubmit={formik.handleSubmit}>
            {filteredSchema.map((field) => {
  
              const isReadOnly =
                typeof field.readOnly === "function"
                  ? field.readOnly(formMode)
                  : field.readOnly;
  
              const commonProps = {
                key: field.name,
                label: field.label,
                name: field.name,
                readOnly: isReadOnly,
              };
  
              switch (field.type) {
                case "text":
                case "email":
                case "password":
                  return <Input type={field.type} {...commonProps} />;
                case "textarea":
                  return <Textarea {...commonProps} />;
                case "select":
                  return <Select options={field.options || []} {...commonProps} />;
                case "dynamicArray":
                  return (
                    <DynamicArrayField
                      key={field.name}
                      label={field.label}
                      name={field.name}
                      minItems={field.validation?.minItems}
                      readOnly={isReadOnly}
                    />
                  );
                default:
                  return null;
              }
            })}
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={!formik.isValid || !formik.dirty}
              >
                Submit
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DynamicForm;
