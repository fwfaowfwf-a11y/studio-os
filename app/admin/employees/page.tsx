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
supabase
} from "@/lib/supabase";


import {
getCurrentUser
} from "@/lib/currentUser";





export default function EmployeesPage(){



const router =
useRouter();



const [employees,setEmployees]
=
useState<Employee[]>([]);



const [name,setName]
=
useState("");



const [code,setCode]
=
useState("");



const [role,setRole]
=
useState<
"admin"|"employee"
>("employee");





async function load(){


const user =
getCurrentUser();



if(
!user ||
user.role!=="admin"
){

router.push("/tasks");

return;

}



const data =
await getEmployees();


setEmployees(data);


}



useEffect(()=>{

load();

},[]);









async function addEmployee(){



if(!name || !code)
return;



await supabase
.from("employees")
.insert({

name,

login_code:code,

role,

active:true

});



setName("");

setCode("");



load();


}









async function deleteEmployee(id:string){


if(
!confirm("确认删除员工？")
)
return;



await supabase
.from("employees")
.delete()
.eq(
"id",
id
);



load();


}









async function updateCode(
id:string
){



const newCode =
prompt(
"输入新的登录码"
);



if(!newCode)
return;



await supabase
.from("employees")
.update({

login_code:newCode

})
.eq(
"id",
id
);



load();


}










return (


<div

style={{

padding:30,

background:"#f4f1ea",

minHeight:"100vh"

}}

>


<div

style={{

maxWidth:900,

margin:"auto",

background:"#fff",

borderRadius:24,

padding:30

}}

>


<h2>

🌱 员工管理

</h2>




<div

style={{

display:"flex",

gap:10,

marginBottom:30

}}

>


<input

placeholder="员工姓名"

value={name}

onChange={
e=>setName(e.target.value)
}

/>


<input

placeholder="登录码"

value={code}

onChange={
e=>setCode(e.target.value)
}

/>


<select

value={role}

onChange={
e=>
setRole(
e.target.value as any
)
}

>

<option value="employee">

员工

</option>


<option value="admin">

老板

</option>


</select>



<button
onClick={addEmployee}
>

添加

</button>


</div>






{

employees.map(

employee=>(


<div

key={employee.id}

style={{

borderBottom:"1px solid #eee",

padding:15,

display:"flex",

justifyContent:"space-between"

}}

>


<div>


<b>

{
employee.name
}

</b>


<br/>


{

employee.role==="admin"

?

"👑老板"

:

"👤员工"

}


</div>





<div>


<button

onClick={()=>updateCode(employee.id)}

>

修改密码

</button>



<button

style={{

marginLeft:10,

color:"red"

}}

onClick={()=>deleteEmployee(employee.id)}

>

删除

</button>


</div>


</div>


)

)

}




</div>


</div>


);


}