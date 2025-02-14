import * as Yup from "yup";
import { FieldValidation, ArrayValidation } from "../types/form";

export const stringValidator = (
  fieldValidation?: FieldValidation
): Yup.StringSchema<string | undefined> => {
  let validator = Yup.string().trim();

  if (fieldValidation) {
    const { required, minLength, maxLength, pattern } = fieldValidation;
    if (required) {
      validator = validator.required("This field is required");
    }
    if (minLength !== undefined) {
      validator = validator.min(
        minLength,
        `Minimum ${minLength} character${minLength > 1 ? "s" : ""} required`
      );
    }
    if (maxLength !== undefined) {
      validator = validator.max(
        maxLength,
        `Maximum ${maxLength} character${maxLength > 1 ? "s" : ""} allowed`
      );
    }
    if (pattern) {
      validator = validator.matches(pattern, "Invalid format");
    }
  }
  return validator;
};

export const DynamicArrayValidator = (
  fieldValidation?: FieldValidation,
  arrayValidation?: ArrayValidation
): Yup.ArraySchema<(string | undefined)[] | undefined, unknown, unknown> => {
  let validator = Yup.array().of(stringValidator(fieldValidation));

  if (arrayValidation) {
    const { required, minFields, maxFields } = arrayValidation;
    if (required) {
      validator = validator.required("Fields cannot be empty");
    }
    if (minFields !== undefined) {
      validator = validator.min(
        minFields,
        `At least ${minFields} option${minFields > 1 ? "s" : ""} required`
      );
    }
    if (maxFields !== undefined) {
      validator = validator.max(
        maxFields,
        `You cannot have more than ${maxFields} option${maxFields > 1 ? "s" : ""}`
      );
    }
  }
  return validator;
};

export const DynamicSelectFieldValidator = (
  relatedFieldName: string
): Yup.StringSchema<string> => {
  return Yup.string()
    .required("You need to select a correct answer")
    .test(
      "match-options",
      "The correct answer must match one of the answer options",
      function (value) {
        const currentOptions: string[] =
          (this.parent && this.parent[relatedFieldName]) || [];
        return currentOptions.some((option) => option?.trim() === value?.trim());
      }
    );
};
