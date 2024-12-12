import { FieldSchema } from "../components/Common/Form/DynamicForm";

export const categoryFormSchema: FieldSchema[] = [
  {
    name: "id",
    label: "ID",
    type: "text",
    readOnly: true,
    validation: {
      required: true,
    },
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
      { value: "enabled", label: "Enabled" },
      { value: "disabled", label: "Disabled" },
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
    validation: {
      required: true,
    },
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    readOnly: true,
    validation: {
      required: true,
      minLength: 1,
      maxLength: 50,
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    readOnly: true,
    validation: {
      required: true,
    },
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
