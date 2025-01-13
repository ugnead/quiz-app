import { FieldSchema } from "../components/Common/Form/DynamicForm";

export const categoryFormSchema: FieldSchema[] = [
  {
    name: "id",
    label: "ID",
    type: "text",
    readOnly: true,
  },
  {
    name: "name",
    label: "Category Name",
    type: "text",
    validation: {
      required: true,
      minLength: 1,
      maxLength: 50,
    },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "enabled", label: "enabled" },
      { value: "disabled", label: "disabled" },
    ],
    validation: {
      required: true,
    },
  },
];

export const subcategoryFormSchema: FieldSchema[] = [
  {
    name: "parentName",
    label: "Parent Category",
    type: "text",
    readOnly: true,
  },
  {
    name: "id",
    label: "ID",
    type: "text",
    readOnly: true,
  },
  {
    name: "name",
    label: "Subcategory Name",
    type: "text",
    validation: {
      required: true,
      minLength: 1,
      maxLength: 50,
    },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "enabled", label: "enabled" },
      { value: "disabled", label: "disabled" },
    ],
    validation: {
      required: true,
    },
  },
];

export const questionFormSchema: FieldSchema[] = [
  {
    name: "parentName",
    label: "Parent Subcategory",
    type: "text",
    readOnly: true,
  },
  {
    name: "id",
    label: "ID",
    type: "text",
    readOnly: true,
  },
  {
    name: "name",
    label: "Question",
    type: "text",
    validation: {
      required: true,
      minLength: 3,
      maxLength: 255,
    },
  },
  {
    name: "answerOptions",
    label: "Answer Options",
    type: "dynamicArray",
    validation: {
      required: true,
      minItems: 2,
    },
  },
  {
    name: "answer",
    label: "Correct Answer",
    type: "select",
    validation: {
      required: true,
      minLength: 1,
      maxLength: 50,
    },
  },
  {
    name: "explanation",
    label: "Explanation",
    type: "textarea",
    validation: {
      minLength: 3,
      maxLength: 255,
    },
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "enabled", label: "enabled" },
      { value: "disabled", label: "disabled" },
    ],
    validation: {
      required: true,
    },
  },
];

export const userFormSchema: FieldSchema[] = [
  {
    name: "id",
    label: "ID",
    type: "text",
    readOnly: true,
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    readOnly: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    readOnly: true,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ],
    validation: {
      required: true,
    },
  },
];
