export type FormMode = "create" | "update";

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface ArrayValidation {
  required?: boolean;
  minFields?: number;
  maxFields?: number;
}

export interface FieldSchema {
  name: string;
  label: string;
  type:
    | "text"
    | "select"
    | "email"
    | "password"
    | "textarea"
    | "dynamicArray"
    | "dynamicSelectField";
  options?: { value: string; label: string }[];
  fieldValidation?: FieldValidation;
  arrayValidation?: ArrayValidation;
  readOnly?: boolean | ((formMode: FormMode) => boolean);
  relatedFieldName?: string;
}
