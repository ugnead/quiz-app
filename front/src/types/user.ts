export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserDto {
    role: "user" | "admin";
  }