import { supabase } from "@/lib/supabase";

import { Employee } from "@/types/employee";



export async function getEmployees(): Promise<Employee[]> {


  console.log(
    "开始获取员工列表..."
  );



  const {
    data,
    error
  } = await supabase

    .from("employees")

    .select("*")

    .eq(
      "active",
      true
    )

    .order(
      "created_at",
      {
        ascending:false
      }
    );




  console.log(
    "员工查询结果:",
    {
      data,
      error
    }
  );





  if(error){


    console.error(
      "获取员工失败:",
      error
    );


    return [];

  }





  return (
    data ?? []
  ) as Employee[];


}