export type UserRole =
  | "admin"
  | "employee";


export interface Employee {

  id:string;

  name:string;

  role:UserRole;

}