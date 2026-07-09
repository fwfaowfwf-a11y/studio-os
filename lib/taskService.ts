import { supabase } from "@/lib/supabase";
import { Task } from "@/types/task";
import { getCurrentUser } from "@/lib/currentUser";



/**
 * 获取任务
 *
 * admin:
 * 查看全部
 *
 * employee:
 * 查看自己的
 */
export async function getTasks(): Promise<Task[]> {


  const user =
    getCurrentUser();



  let query =
    supabase
      .from("tasks")
      .select(`
  *,
  assigned_user:employees!tasks_assigned_to_fkey(
    id,
    name,
    avatar
  )
`)




  if(
    !user ||
    user.role==="admin"
  ){


    query =
      query
      .order(
        "sort_order",
        {
          ascending:true
        }
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      );


  }
  else{


    query =
      query
      .eq(
        "assigned_to",
        user.id
      )
      .order(
        "sort_order",
        {
          ascending:true
        }
      )
      .order(
        "created_at",
        {
          ascending:false
        }
      );


  }




  const {
    data,
    error
  } =
  await query;



  if(error){

    console.error(
      "获取任务失败:",
      error
    );

    return [];

  }



  return (data ?? []) as Task[];

}









/**
 * 创建任务
 *
 * 只有老板
 */
export async function createTask(task: {

title:string;

priority?:
"green"|"orange"|"red";

category_id?:string|null;

assigned_to?:string|null;

created_by?:string|null;

repeat_type?:
"none"|"daily"|"interval"|"weekly"|"date";

repeat_rule?:string|null;

start_time?:string|null;

due_time?:string|null;

notes?:string|null;


}):Promise<Task|null>{



const user =
getCurrentUser();


// 权限检查

if(
 !user ||
 user.role!=="admin"
){

 console.error(
  "员工无权创建任务"
 );

 return null;

}






const {
 data,
 error
}=

await supabase
.from("tasks")
.insert({


title:task.title,


priority:
task.priority ??
"green",


status:
"todo",


category_id:
task.category_id ??
null,


assigned_to:
task.assigned_to ??
null,


created_by:
user.id,


repeat_type:
task.repeat_type ??
"none",


repeat_rule:
task.repeat_rule ??
null,


start_time:
task.start_time ??
null,


due_time:
task.due_time ??
null,


notes:
task.notes ??
null,


})
.select()
.single();





if(error){

console.error(
"创建任务失败:",
error
);

return null;

}



return data as Task;


}









/**
 * 完成任务
 */
export async function toggleTaskDone(

taskId:string,

done:boolean

){


const user =
getCurrentUser();


// 员工只能操作自己的任务

if(
!user
){

return;

}



let query =
supabase
.from("tasks")
.update({


status:
done
?
"done"
:
"todo",


completed_at:

done

?

new Date()
.toISOString()

:

null


})
.eq(
"id",
taskId
);



if(
user.role!=="admin"
){

query =
query.eq(
"assigned_to",
user.id
);

}



const {
error
}=

await query;



if(error){

console.error(
"更新任务失败:",
error
);

}


}// =========================
// 删除任务
// =========================

export async function deleteTask(

 taskId:string

){


 const user =
 getCurrentUser();



 // 员工禁止删除

 if(
   !user ||
   user.role!=="admin"
 ){

   console.error(
    "员工无权删除任务"
   );

   return;

 }




 const {
  error
 }=

 await supabase
 .from("tasks")
 .delete()
 .eq(
  "id",
  taskId
 );



 if(error){

 console.error(
  "删除任务失败:",
  error
 );

 }


}









// =========================
// 是否逾期
// =========================

export function isOverdue(

 task:Task

){


 if(
  !task.due_time
 )
 return false;



 if(
  task.status==="done"
 )
 return false;



 return (

 new Date(
  task.due_time
 )
 .getTime()

 <

 Date.now()

 );


}









// =========================
// 获取下一次时间
// =========================

export function getNextDueTime(

 task:Task

):Date|null{


 const now =
 new Date();



 switch(
 task.repeat_type ??
 "none"
 ){



 case "daily":


 return new Date(

  now.getTime()
  +
  86400000

 );





 case "interval":{


 const days =

 parseInt(

 task.repeat_rule ??
 "1",

 10

 );


 return new Date(

 now.getTime()
 +
 days *
 86400000

 );


 }




 case "weekly":


 return new Date(

 now.getTime()
 +
 7 *
 86400000

 );






 case "date":


 return task.due_time

 ?

 new Date(
 task.due_time
 )

 :

 null;





 default:


 return null;


 }


}









// =========================
// 是否重复任务
// =========================

export function shouldRepeat(

task:Task

){


return (

task.repeat_type ??
"none"

)!=="none";


}









// =========================
// 生成下一条重复任务
// =========================

export async function generateNextTask(

 task:Task

):Promise<Task|null>{



if(
 !shouldRepeat(task)
)

return null;





const nextTime =

getNextDueTime(task);



if(
 !nextTime
)

return null;







const {

 data:exists

}=


await supabase

.from("tasks")

.select("id")

.eq(

"repeat_source_id",

task.id

)

.eq(

"due_time",

nextTime.toISOString()

)

.maybeSingle();





if(exists)

return null;







const {

data,

error

}=


await supabase

.from("tasks")

.insert({



title:

task.title,



priority:

task.priority,



status:

"todo",



category_id:

task.category_id ??
null,



assigned_to:

task.assigned_to ??
null,



created_by:

task.created_by ??
null,



repeat_type:

task.repeat_type ??
"none",



repeat_rule:

task.repeat_rule ??
null,



due_time:

nextTime.toISOString(),



})

.select()

.single();







if(error){


console.error(

"生成重复任务失败:",

error

);


return null;


}





return data as Task;


}









// =========================
// 完成任务并生成下一条
// =========================

export async function completeTaskAndHandleRepeat(

task:Task

){



await toggleTaskDone(

task.id,

true

);



await generateNextTask(

task

);



}









// =========================
// 自动修复重复任务
// =========================

export async function autoFixTasks(

tasks:Task[]

){


const results:Task[]=[];




for(
 const task of tasks
){



if(
 !shouldRepeat(task)
)

continue;





if(
 task.status==="done"
){



const next =

await generateNextTask(

task

);



if(next)

results.push(next);



}



}




return results;


}









// =========================
// 修改状态
// =========================

export async function updateTaskStatus(

taskId:string,

status:

"todo"

|

"doing"

|

"done"

){



const user =
getCurrentUser();




if(
 !user
)
return;





let query =

supabase

.from("tasks")

.update({


status,


completed_at:

status==="done"

?

new Date()
.toISOString()

:

null



})

.eq(

"id",

taskId

);






// 员工只能修改自己的

if(

user.role!=="admin"

){


query =

query.eq(

"assigned_to",

user.id

);


}






const {

error

}=

await query;





if(error){


console.error(

"更新状态失败:",

error

);


}


}