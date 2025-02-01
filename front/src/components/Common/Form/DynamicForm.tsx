import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

import { FieldSchema, FormMode } from "../../../types/form";

import Input from "./Fields/Input";
import Select from "./Fields/Select";
import Textarea from "./Fields/Textarea";
import DynamicArray from "./Fields/DynamicArray";
import DynamicSelectField from "./Fields/DynamicSelectField";

import Button from "../Button";

interface DynamicFormProps {
  schema: FieldSchema[];
  initialValues?: Record<string, string | string[]>;
  onSubmit: (values: Record<string, string | string[]>) => void;
  formMode?: FormMode;
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
            field.arrayValidation?.minFields || 2,
            `At least ${field.arrayValidation?.minFields || 2} option(s) required`
          )
          .max(
            field.arrayValidation?.maxFields || 5,
            `You cannot have more than ${field.arrayValidation?.maxFields || 5} option(s)`
          );
        if (field.fieldValidation?.required) {
          arrayValidator = arrayValidator.required("This field is required");
        }
        acc[field.name] = arrayValidator;
      } else if (field.type === "dynamicSelectField") {
        const relatedFieldOptions = initialValues[field.relatedFieldName] || [];
        acc[field.name] = Yup.string()
          .required("A correct answer is required")
          .oneOf(
            relatedFieldOptions,
            "The correct answer must match one of the answer options"
          );
      } else {
        let validator = Yup.string();
        if (field.fieldValidation) {
          if (field.fieldValidation.required) {
            validator = validator.required("This field is required");
          }
          if (field.fieldValidation.minLength) {
            validator = validator.min(
              field.fieldValidation.minLength,
              `Minimum ${field.fieldValidation.minLength} characters`
            );
          }
          if (field.fieldValidation.maxLength) {
            validator = validator.max(
              field.fieldValidation.maxLength,
              `Maximum ${field.fieldValidation.maxLength} characters`
            );
          }
          if (field.fieldValidation.pattern) {
            validator = validator.matches(
              field.fieldValidation.pattern,
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
      validateOnChange={true}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form autoComplete="off" onSubmit={formik.handleSubmit}>
            {filteredSchema.map((field, index) => {
              const isReadOnly =
                typeof field.readOnly === "function"
                  ? field.readOnly(formMode)
                  : field.readOnly;

              const commonProps = {
                name: field.name,
                label: field.label,
                readOnly: isReadOnly,
              };

              switch (field.type) {
                case "text":
                case "email":
                case "password":
                  return (
                    <Input
                      key={`${field.name}`}
                      type={field.type}
                      {...commonProps}
                    />
                  );
                case "textarea":
                  return <Textarea key={`${field.name}`} {...commonProps} />;
                case "select":
                  return (
                    <Select
                      key={`${field.name}`}
                      options={field.options || []}
                      {...commonProps}
                    />
                  );
                case "dynamicSelectField": {
                  const arrayFieldSchema = schema.find(
                    (s) => s.name === field.relatedFieldName
                  );
                  const minFieldsFromReference =
                    arrayFieldSchema?.arrayValidation?.minFields || 2;
                  return (
                    <DynamicSelectField
                      key={`${field.name}-${index}`}
                      optionsFieldName={field.relatedFieldName || ""}
                      minAnswers={minFieldsFromReference}
                      {...commonProps}
                    />
                  );
                }
                case "dynamicArray":
                  return (
                    <DynamicArray
                      key={`${field.name}-${index}`}
                      minFields={field.arrayValidation?.minFields}
                      {...commonProps}
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
