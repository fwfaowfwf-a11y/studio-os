"use client";

import { Task } from "@/types/task";


interface Props {

  task: Task;

  onToggle: (
    task: Task
  ) => void;

  onDelete: (
    id: string
  ) => void;

}





export default function TaskCard({

  task,

  onToggle,

  onDelete,

}: Props) {



  // =========================
  // 🎨 优先级图标
  // =========================

  function getPriorityIcon(){


    switch(task.priority){


      case "red":

        return "▲▲";



      case "orange":

        return "▲";



      default:

        return "●";

    }

  }






  // =========================
  // 状态文字
  // =========================

  function getStatusText(){


    switch(task.status){


      case "done":

        return "✅ 已完成";


      case "doing":

        return "🔵 进行中";


      default:

        return "⚪ 待开始";


    }

  }








  // =========================
  // 重复文字
  // =========================

  function getRepeatText(){


    switch(task.repeat_type){


      case "daily":

        return "🔁 每天";


      case "weekly":

        return "🔁 每周";


      case "interval":

        return `🔁 每${task.repeat_rule || 1}天`;


      case "date":

        return "📅 指定日期";


      default:

        return "";

    }

  }








  // =========================
  // 颜色
  // =========================

  function getColor(){


    if(
      task.status==="done"
    )
      return "#999";



    switch(task.priority){


      case "red":

        return "#e53935";


      case "orange":

        return "#fb8c00";


      default:

        return "#43a047";


    }

  }







  const isDone =
    task.status==="done";





  return (


    <div

      style={{

        padding:"14px",

        borderBottom:
          "1px solid #eee",

        cursor:"pointer",

        color:getColor(),

        background:
          isDone
          ? "#fafafa"
          : "white",

        transition:
          "0.2s",

      }}



      onClick={()=>
        onToggle(task)
      }

    >




      <div

        style={{

          display:"flex",

          alignItems:"center",

          gap:10,

        }}

      >



        {/* 优先级 */}

        <span
          style={{
            width:30
          }}
        >

          {getPriorityIcon()}

        </span>





        {/* 标题 */}

        <span

          style={{

            flex:1,

            fontSize:16,

            fontWeight:500,

            textDecoration:

              isDone

              ?

              "line-through"

              :

              "none",

          }}

        >

          {task.title}

        </span>





        {/* 删除 */}

        <button


          onClick={(e)=>{

            e.stopPropagation();

            onDelete(task.id);

          }}


          style={{

            border:"none",

            background:"transparent",

            color:"red",

            cursor:"pointer",

          }}

        >

          删除

        </button>



      </div>








      {/* 分配人员 */}

{
  task.assigned_user &&

  <div

    style={{

      marginTop:10,

      marginLeft:40,

      display:"flex",

      alignItems:"center",

      gap:8,

      fontSize:13,

      color:"#55705a"

    }}

  >


    {

      task.assigned_user.avatar

      ?

      <img

        src={
          task.assigned_user.avatar
        }

        style={{

          width:24,

          height:24,

          borderRadius:"50%"

        }}

      />

      :

      <span>

        🌱

      </span>

    }



    <span>

      分配给：

      <b>

      {
        task.assigned_user.name
      }

      </b>

    </span>


  </div>

}
{/* 第二行信息 */}

      <div

        style={{

          marginTop:8,

          marginLeft:40,

          display:"flex",

          gap:15,

          fontSize:13,

          color:"#666",

          flexWrap:"wrap",

        }}

      >



        <span>

          {getStatusText()}

        </span>





        {

          getRepeatText()

          &&

          <span>

            {getRepeatText()}

          </span>

        }





        {

          task.due_time

          &&

          <span>

            ⏰

            {

              new Date(
                task.due_time
              )
              .toLocaleString()

            }

          </span>

        }



      </div>








      {/* 备注 */}

      {

        task.notes

        &&

        <div

          style={{

            marginTop:8,

            marginLeft:40,

            fontSize:13,

            color:"#777",

          }}

        >

          📝

          {task.notes}


        </div>

      }








      {/* 完成时间 */}

      {

        task.completed_at

        &&

        <div

          style={{

            marginTop:8,

            marginLeft:40,

            fontSize:12,

            color:"#999",

          }}

        >

          完成：

          {

            new Date(
              task.completed_at
            )
            .toLocaleString()

          }

        </div>

      }




    </div>


  );

}