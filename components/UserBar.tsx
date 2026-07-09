"use client";


import {
  useEffect,
  useState
} from "react";


import {
  useRouter
} from "next/navigation";


import {
  Employee
} from "@/types/employee";


import {
  getCurrentUser,
  clearCurrentUser
} from "@/lib/currentUser";



export default function UserBar(){


  const router =
    useRouter();



  const [user,setUser]
  =
  useState<Employee|null>(null);



  useEffect(()=>{


    setUser(
      getCurrentUser()
    );


  },[]);





  function logout(){


    clearCurrentUser();


    router.push(
      "/login"
    );


  }





  if(!user)
    return null;




  return (

    <div

      style={{

        display:"flex",

        justifyContent:"space-between",

        alignItems:"center",

        padding:"10px 20px",

        borderBottom:"1px solid #ddd"

      }}

    >


      <div>

        🧠 Studio OS

      </div>




      <div>


        {
          user.role==="admin"

          ?

          "👑 "

          :

          "👤 "

        }


        {user.name}




        <button

          onClick={logout}

          style={{

            marginLeft:15,

            padding:"5px 10px"

          }}

        >

          切换账号

        </button>



      </div>



    </div>

  );


}