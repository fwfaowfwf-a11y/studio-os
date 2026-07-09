export type TaskRepeatType =
  | "none"
  | "daily"
  | "interval"
  | "weekly"
  | "date";


export type TaskStatus =
  | "todo"
  | "doing"
  | "done";



export interface Task {


  id:string;


  title:string;


  priority:
    | "green"
    | "orange"
    | "red";



  status:TaskStatus;



  category_id?:string|null;



  assigned_to?:string|null;



  created_by?:string|null;



  // 👇 新增：任务执行人信息

  assigned_user?:{

    id:string;

    name:string;

    avatar?:string|null;

  } | null;




  repeat_type?:TaskRepeatType;



  repeat_rule?:string|null;



  start_time?:string|null;



  due_time?:string|null;



  completed_at?:string|null;



  sort_order?:number|null;



  notes?:string|null;



  repeat_source_id?:string|null;



  created_at?:string;



  updated_at?:string;


}