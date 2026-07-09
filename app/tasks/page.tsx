"use client";


import UserBar from "@/components/UserBar";

import {
  useEffect,
  useState
} from "react";


import {
  useRouter
} from "next/navigation";


import {
  Task
} from "@/types/task";


import {
  Employee
} from "@/types/employee";


import {
  supabase
} from "@/lib/supabase";


import {
  getTasks,
  toggleTaskDone,
  deleteTask,
  isOverdue,
  completeTaskAndHandleRepeat,
  autoFixTasks,
  createTask,
  updateTaskStatus,
} from "@/lib/taskService";


import TaskToolbar from "@/components/tasks/TaskToolbar";
import TaskStats from "@/components/tasks/TaskStats";
import TaskCard from "@/components/tasks/TaskCard";
import ConfirmDialog from "@/components/tasks/ConfirmDialog";


import {
  getCurrentUser
} from "@/lib/currentUser";





export default function TasksPage(){



const router =
useRouter();




const [tasks,setTasks]
=
useState<Task[]>([]);



const [currentUser,setCurrentUser]
=
useState<Employee|null>(null);



const [loading,setLoading]
=
useState(false);



const [confirmOpen,setConfirmOpen]
=
useState(false);



const [confirmTitle,setConfirmTitle]
=
useState("");



const [confirmAction,setConfirmAction]
=
useState<
null |
(()=>Promise<void>)
>(null);








async function load(){


setLoading(true);



const user =
getCurrentUser();



setCurrentUser(user);




const data =
await getTasks();



await autoFixTasks(data);



const refreshed =
await getTasks();




let result =
refreshed;




if(

user &&

user.role !== "admin"

){


result =

refreshed.filter(

task =>

task.assigned_to === user.id

);


}




setTasks(result);



setLoading(false);


}









useEffect(()=>{


load();



const channel =

supabase

.channel(
"tasks-realtime"
)


.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"tasks",

},


()=>{

load();

}


)


.subscribe();






return ()=>{


supabase.removeChannel(
channel
);


};



},[]);










async function handleAdd(

title:string,


priority:
|"green"
|"orange"
|"red",


repeat_type:
|"none"
|"daily"
|"weekly"
|"interval"
|"date",


repeat_rule:string|null,


due_time:string|null,


notes:string|null,


assigned_to:string|null

){



if(

currentUser?.role !== "admin"

){

return;

}




await createTask({

title,

priority,

repeat_type,

repeat_rule,

due_time,

notes,

assigned_to,

});



await load();


}










function handleToggle(task:Task){


if(task.status==="todo"){


updateTaskStatus(

task.id,

"doing"

);


load();


return;

}






if(task.status==="doing"){


setConfirmTitle(
"确认完成任务？"
);



setConfirmAction(

()=>async()=>{


await completeTaskAndHandleRepeat(
task
);



await load();


setConfirmOpen(false);


}

);



setConfirmOpen(true);


return;

}






if(task.status==="done"){


setConfirmTitle(
"确认重新打开任务？"
);



setConfirmAction(

()=>async()=>{


await toggleTaskDone(

task.id,

false

);



await load();


setConfirmOpen(false);


}

);



setConfirmOpen(true);


}



}
function handleDelete(id:string){


setConfirmTitle(
"确认删除任务？"
);



setConfirmAction(

()=>async()=>{


await deleteTask(id);



await load();



setConfirmOpen(false);



}

);



setConfirmOpen(true);


}









const total =
tasks.length;



const done =
tasks.filter(

t=>

t.status==="done"

).length;








const sortedTasks =

[...tasks].sort(

(a,b)=>{


const aOverdue =
isOverdue(a);


const bOverdue =
isOverdue(b);



if(
aOverdue &&
!bOverdue
)

return -1;



if(
!aOverdue &&
bOverdue
)

return 1;





if(
a.priority==="red" &&
b.priority!=="red"
)

return -1;



if(
a.priority!=="red" &&
b.priority==="red"
)

return 1;




return (

(a.sort_order ?? 0)

-

(b.sort_order ?? 0)

);


}

);










return (

<div

style={{

minHeight:"100vh",

background:"#f4f1ea",

padding:"30px 20px"

}}

>


<UserBar />





<div

style={{

maxWidth:1000,

margin:"30px auto",

background:"#ffffff",

borderRadius:24,

padding:30,

boxShadow:
"0 10px 30px rgba(0,0,0,0.06)"

}}

>






{/* 顶部LOGO */}

<div

style={{

display:"flex",

alignItems:"center",

gap:15,

marginBottom:25

}}

>


<div

style={{

width:58,

height:58,

borderRadius:"50%",

background:"#55705a",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:30

}}

>

🌱

</div>



<div>

<h2

style={{

margin:0,

color:"#344438"

}}

>

Studio OS

</h2>


<p

style={{

margin:0,

color:"#888"

}}

>

微型生态工作室管理系统

</p>


</div>


</div>










{/* 用户卡片 */}

{

currentUser &&


<div

style={{

display:"flex",

alignItems:"center",

gap:12,

padding:15,

marginBottom:20,

borderRadius:16,

background:"#f8f6f0"

}}

>


<div

style={{

width:45,

height:45,

borderRadius:"50%",

background:"#dfe8dc",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:22

}}

>

{

currentUser.role==="admin"

?

"👑"

:

"👤"

}

</div>





<div>


<div

style={{

fontWeight:600,

color:"#344438"

}}

>

{currentUser.name}

</div>





<div

style={{

fontSize:13,

color:"#888"

}}

>

{

currentUser.role==="admin"

?

"管理员"

:

"员工"

}

</div>






{/* 👑 老板入口 */}

{

currentUser.role==="admin"

&&


<button

onClick={()=>router.push("/admin/employees")}

style={{

marginTop:10,

padding:"6px 14px",

borderRadius:12,

border:"1px solid #55705a",

background:"#ffffff",

color:"#55705a",

cursor:"pointer"

}}

>

⚙ 员工管理

</button>


}



</div>


</div>


}









<TaskStats

total={total}

done={done}

/>









{/* 只有老板显示添加任务 */}

{

currentUser?.role==="admin"

&&

<TaskToolbar

onAdd={handleAdd}

/>

}









{

loading &&

<p>

加载中...

</p>

}









<div

style={{

marginTop:20

}}

>


{

sortedTasks.map(

task=>(


<TaskCard

key={task.id}

task={task}

onToggle={handleToggle}

onDelete={handleDelete}

/>


)

)

}


</div>









<ConfirmDialog

open={confirmOpen}

title={confirmTitle}


onCancel={

()=>setConfirmOpen(false)

}


onConfirm={

()=>confirmAction?.()

}


/>





</div>


</div>


);


}