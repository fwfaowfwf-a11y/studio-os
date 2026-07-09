export type EmployeeRole =
  | "admin"
  | "employee";


export interface Employee {

  id:string;

  name:string;

  role:EmployeeRole;

  avatar?:string|null;

  active:boolean;

  login_code?:string;

  created_at?:string;

}