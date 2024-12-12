import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "./Fields/Input";
import Select from "./Fields/Select";
import Textarea from "./Fields/Textarea";
import Button from "../Button";

export interface FieldSchema {
  name: string;
  label: string;
  type: "text" | "select" | "email" | "password" | "textarea";
  options?: { value: string; label: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
  readOnly?: boolean | ((formMode: "create" | "update") => boolean);
}

interface DynamicFormProps {
  schema: FieldSchema[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
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
      let validator = Yup.string();

      if (field.validation) {
        if (field.validation.required) {
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
      return acc;
    },
    {} as Record<string, Yup.StringSchema>
  );

  const formik = useFormik({
    initialValues: schema.reduce(
      (acc, field) => {
        acc[field.name] = initialValues[field.name] || "";
        return acc;
      },
      {} as Record<string, string>
    ),
    validationSchema: Yup.object(validationSchema),
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {schema.map((field) => {
        const error =
          typeof formik.errors[field.name] === "string"
            ? formik.errors[field.name]
            : undefined;

        const isReadOnly =
          typeof field.readOnly === "function"
            ? field.readOnly(formMode)
            : field.readOnly;

        const commonProps = {
          key: field.name,
          label: field.label,
          name: field.name,
          value: formik.values[field.name],
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: error,
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
          default:
            return null;
        }
      })}
      <div className="flex justify-end mt-4">
        <Button type="submit" variant="primary" disabled={!formik.isValid || !formik.dirty}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;
