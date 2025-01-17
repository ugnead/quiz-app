export interface Category {
  _id: string;
  name: string;
  status: "enabled" | "disabled";
}

export interface CreateCategoryDto {
  name: string;
  status?: "enabled" | "disabled";
}

export interface UpdateCategoryDto {
  name?: string;
  status?: "enabled" | "disabled";
}