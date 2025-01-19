export interface Subcategory {
  _id: string;
  name: string;
  status: "enabled" | "disabled";
}

export interface CreateSubcategoryDto {
  name: string;
  status?: "enabled" | "disabled";
}

export interface UpdateSubcategoryDto {
  name?: string;
  status?: "enabled" | "disabled";
}