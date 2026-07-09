"use client";

import { useEffect, useState } from "react";

import { Employee } from "@/types/employee";

import { getEmployees } from "@/lib/employeeService";

import {
  setCurrentUser
} from "@/lib/currentUser";


type Props = {

  onChange?:()=>void;

};


export default function UserSwitcher({
  onChange
}:Props){


  const [employees,setEmployees]
  =
  useState<Employee[]>([]);


  const [current,setCurrent]
  =
  useState("");



 useEffect(()=>{


  getEmployees()
  .then(data=>{

    console.log("员工列表:", data);

    setEmployees(data);

  });


},[]);




  function changeUser(id:string){


    setCurrent(id);



    const user =
      employees.find(

        e=>e.id===id

      );



    if(user){


      setCurrentUser(user);


      onChange?.();


    }


  }





  return (

    <div
      style={{
        marginBottom:20
      }}
    >


      <span>

        当前用户：

      </span>



      <select

        value={current}

        onChange={

          e=>
          changeUser(
            e.target.value
          )

        }

      >


        <option value="">

          请选择

        </option>



        {
          employees.map(

            employee=>(


              <option

                key={employee.id}

                value={employee.id}

              >

                {employee.name}

                （{employee.role}）

              </option>


            )

          )
        }


      </select>



    </div>

  );

}