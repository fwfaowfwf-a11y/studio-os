"use client";

import { useEffect, useState } from "react";

import { Employee } from "@/types/employee";

import { getEmployees } from "@/lib/employeeService";


type RepeatType =
  | "none"
  | "daily"
  | "weekly"
  | "interval"
  | "date";



type Props = {

  onAdd: (

    title: string,

    priority:
      | "green"
      | "orange"
      | "red",

    repeat_type: RepeatType,

    repeat_rule: string | null,

    due_time: string | null,

    notes: string | null,

    assigned_to: string | null

  ) => void;

};




export default function TaskToolbar({
  onAdd
}: Props) {



  const [title,setTitle] =
    useState("");



  const [priority,setPriority] =
    useState<
      "green" |
      "orange" |
      "red"
    >("green");



  const [repeatType,setRepeatType] =
    useState<RepeatType>("none");



  const [repeatRule,setRepeatRule] =
    useState("");



  const [dueTime,setDueTime] =
    useState("");



  const [notes,setNotes] =
    useState("");



  // =========================
  // 👥 员工
  // =========================

  const [employees,setEmployees] =
    useState<Employee[]>([]);



  const [assignedTo,setAssignedTo] =
    useState("");



  useEffect(()=>{

    getEmployees()
      .then(setEmployees);

  },[]);





  function handleAdd(){


    if(!title.trim())
      return;



    onAdd(

      title,

      priority,

      repeatType,

      repeatRule || null,

      dueTime || null,

      notes || null,

      assignedTo || null

    );



    setTitle("");

    setPriority("green");

    setRepeatType("none");

    setRepeatRule("");

    setDueTime("");

    setNotes("");

    setAssignedTo("");

  }





  return (

    <div
      style={{
        display:"flex",
        flexDirection:"column",
        gap:10,
        marginBottom:20
      }}
    >



      <input

        value={title}

        onChange={
          e=>setTitle(e.target.value)
        }

        placeholder="输入任务"

        style={{
          padding:8
        }}

      />





      <div
        style={{
          display:"flex",
          gap:10
        }}
      >


        <select

          value={priority}

          onChange={
            e=>
            setPriority(
              e.target.value as
              "green" |
              "orange" |
              "red"
            )
          }

        >

          <option value="green">
            🟢 绿色
          </option>


          <option value="orange">
            🟧 橙色
          </option>


          <option value="red">
            🔴 红色
          </option>


        </select>





        <select

          value={repeatType}

          onChange={
            e=>
            setRepeatType(
              e.target.value as RepeatType
            )
          }

        >

          <option value="none">
            不重复
          </option>


          <option value="daily">
            每天
          </option>


          <option value="weekly">
            每周
          </option>


          <option value="interval">
            间隔
          </option>


          <option value="date">
            指定日期
          </option>


        </select>




        {/* 👥 负责人 */}

        <select

          value={assignedTo}

          onChange={
            e=>setAssignedTo(e.target.value)
          }

        >

          <option value="">
            未分配
          </option>


          {
            employees.map(

              employee=>(

                <option

                  key={employee.id}

                  value={employee.id}

                >

                  {employee.name}

                </option>

              )

            )
          }


        </select>



      </div>






      {
        repeatType === "interval" &&

        <input

          value={repeatRule}

          onChange={
            e=>setRepeatRule(e.target.value)
          }

          placeholder="间隔天数，例如：3"

          style={{
            padding:8
          }}

        />

      }







      {
        repeatType === "date" &&

        <input

          type="datetime-local"

          value={dueTime}

          onChange={
            e=>setDueTime(e.target.value)
          }


          style={{
            padding:8
          }}

        />

      }







      <textarea

        value={notes}

        onChange={
          e=>setNotes(e.target.value)
        }

        placeholder="备注"

        style={{
          padding:8,
          minHeight:60
        }}

      />







      <button

        onClick={handleAdd}

        style={{
          padding:8
        }}

      >

        添加任务

      </button>




    </div>

  );

}