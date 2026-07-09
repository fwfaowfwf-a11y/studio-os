import { supabase } from "@/lib/supabase";

import { Employee } from "@/types/employee";



export async function getEmployees(){

  const {data,error}=

    await supabase

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



  if(error){

    console.error(
      "获取员工失败:",
      error
    );

    return [];

  }


  return data as Employee[];

}