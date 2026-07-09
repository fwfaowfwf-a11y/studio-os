import { Employee } from "@/types/employee";


const STORAGE_KEY =
  "studio_current_user";



// 保存当前用户

export function setCurrentUser(
  user: Employee
){

  if(
    typeof window === "undefined"
  )
    return;


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(user)
  );

}




// 获取当前用户

export function getCurrentUser()
: Employee | null {


  if(
    typeof window === "undefined"
  )
    return null;



  const data =
    localStorage.getItem(
      STORAGE_KEY
    );



  if(
    !data
  )
    return null;



  try {


    const user =
      JSON.parse(data);



    return user as Employee;



  } catch(error){


    console.error(
      "读取用户失败:",
      error
    );


    return null;


  }

}




// 清除当前用户

export function clearCurrentUser(){


  if(
    typeof window === "undefined"
  )
    return;



  localStorage.removeItem(
    STORAGE_KEY
  );


}