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
  getEmployees
} from "@/lib/employeeService";


import {
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser
} from "@/lib/currentUser";





export default function LoginPage(){



  const router =
    useRouter();




  const [employees,setEmployees]
  =
  useState<Employee[]>([]);



  const [selected,setSelected]
  =
  useState("");



  const [loginCode,setLoginCode]
  =
  useState("");



  const [current,setCurrent]
  =
  useState<Employee|null>(null);



  const [loading,setLoading]
  =
  useState(true);



  const [error,setError]
  =
  useState("");







  useEffect(()=>{


    const user =
      getCurrentUser();



    if(user){

      setCurrent(user);

    }




    getEmployees()

    .then(data=>{


      setEmployees(data);


      setLoading(false);


    });



  },[]);









  function login(){


    setError("");



    const user =

    employees.find(

      e=>

      e.id===selected

    );





    if(!user){


      setError(
        "请选择身份"
      );


      return;

    }







    if(

      user.login_code !== loginCode

    ){


      setError(
        "登录码错误"
      );


      return;


    }






    setCurrentUser(
      user
    );



    router.push(
      "/tasks"
    );


  }








  function logout(){


    clearCurrentUser();


    setCurrent(null);


    setSelected("");


    setLoginCode("");


  }







  if(loading){


    return (

      <div

        style={{

          minHeight:"100vh",

          display:"flex",

          alignItems:"center",

          justifyContent:"center"

        }}

      >

        加载工作室成员...

      </div>

    );


  }









  return (

    <div

      style={{

        minHeight:"100vh",

        background:

        "linear-gradient(135deg,#eef2e8,#faf8f1)",


        display:"flex",

        alignItems:"center",

        justifyContent:"center",

        padding:20

      }}

    >





      <div

        style={{

          width:"100%",

          maxWidth:420,

          background:"#fff",

          borderRadius:24,

          padding:35,

          boxShadow:

          "0 20px 60px rgba(0,0,0,0.12)"

        }}

      >





        {/* Logo */}

        <div

          style={{

            textAlign:"center",

            marginBottom:30

          }}

        >


          <div

            style={{

              fontSize:48

            }}

          >

            🌿

          </div>



          <h1

            style={{

              margin:0,

              fontSize:26,

              letterSpacing:1

            }}

          >

            Studio OS

          </h1>



          <p

            style={{

              color:"#777",

              marginTop:8

            }}

          >

            微型生态工作室管理系统

          </p>


        </div>










        {

          current

          ?

          (

          <div>


            <div

              style={{

                background:"#f7f7f2",

                padding:20,

                borderRadius:18,

                textAlign:"center"

              }}

            >



              <div

                style={{

                  fontSize:50

                }}

              >

                {

                  current.avatar

                  ?

                  <img

                    src={current.avatar}

                    style={{

                      width:70,

                      height:70,

                      borderRadius:"50%"

                    }}

                  />

                  :

                  "👤"

                }


              </div>






              <h3>

                {

                  current.name

                }

              </h3>



              <p>


                {

                  current.role==="admin"

                  ?

                  "👑 工作室管理员"

                  :

                  "🌱 工作人员"

                }


              </p>



            </div>







            <button

              onClick={()=>router.push("/tasks")}

              style={{

                width:"100%",

                marginTop:20,

                padding:14,

                borderRadius:12,

                border:0,

                background:"#314b36",

                color:"#fff",

                fontSize:16

              }}

            >

              进入 Studio OS


            </button>







            <button

              onClick={logout}

              style={{

                width:"100%",

                marginTop:12,

                padding:12,

                borderRadius:12,

                background:"#fff",

                border:"1px solid #ddd"

              }}

            >

              切换账号


            </button>



          </div>

          )

          :


          (


          <>



          <h3>

            选择成员

          </h3>





          <div

            style={{

              display:"grid",

              gap:12

            }}

          >


          {

            employees.map(

              employee=>(


              <div

                key={employee.id}

                onClick={()=>{

                  setSelected(employee.id);

                  setLoginCode("");

                }}


                style={{

                  display:"flex",

                  alignItems:"center",

                  gap:15,

                  padding:15,

                  borderRadius:16,

                  cursor:"pointer",

                  border:

                  selected===employee.id

                  ?

                  "2px solid #314b36"

                  :

                  "1px solid #ddd",


                  background:

                  selected===employee.id

                  ?

                  "#f0f5ed"

                  :

                  "#fff"

                }}

              >



                <div

                  style={{

                    fontSize:35

                  }}

                >

                {

                  employee.avatar

                  ?

                  <img

                    src={employee.avatar}

                    style={{

                      width:45,

                      height:45,

                      borderRadius:"50%"

                    }}

                  />

                  :

                  "👤"

                }


                </div>





                <div>


                  <b>

                    {employee.name}

                  </b>



                  <div

                    style={{

                      fontSize:13,

                      color:"#777"

                    }}

                  >

                  {

                    employee.role==="admin"

                    ?

                    "👑 老板"

                    :

                    "🌱 员工"

                  }


                  </div>


                </div>




              </div>


              )

            )

          }


          </div>







          <input

            type="password"

            value={loginCode}

            onChange={

              e=>

              setLoginCode(
                e.target.value
              )

            }


            placeholder="输入登录码"


            style={{

              marginTop:20,

              width:"100%",

              padding:14,

              borderRadius:12,

              border:"1px solid #ddd"

            }}

          />






          {

            error &&

            <p

              style={{

                color:"red"

              }}

            >

              {error}

            </p>

          }






          <button

            onClick={login}

            style={{

              width:"100%",

              marginTop:15,

              padding:14,

              borderRadius:12,

              border:0,

              background:"#314b36",

              color:"#fff",

              fontSize:16

            }}

          >

            登录系统

          </button>



          </>


          )

        }



      </div>


    </div>

  );


}