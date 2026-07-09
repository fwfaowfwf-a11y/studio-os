import { NextResponse } from "next/server";

import type {
  NextRequest
} from "next/server";



export function middleware(
  request: NextRequest
){


  const pathname =
    request.nextUrl.pathname;



  const user =
    request.cookies.get(
      "studio_current_user"
    );





  // =====================
  // 登录页面
  // =====================

  // 永远允许访问登录页
  // 不自动跳转

  if(
    pathname === "/login"
  ){

    return NextResponse.next();

  }






  // =====================
  // 首页
  // =====================

  // 访问首页
  // 进入登录页

  if(
    pathname === "/"
  ){

    return NextResponse.redirect(

      new URL(
        "/login",
        request.url
      )

    );

  }







  // =====================
  // 任务页面保护
  // =====================

  // 没登录不能进入任务

  if(

    pathname.startsWith("/tasks")

    &&

    !user

  ){


    return NextResponse.redirect(

      new URL(
        "/login",
        request.url
      )

    );


  }







  return NextResponse.next();


}







export const config = {


  matcher:[

    "/",

    "/login",

    "/tasks/:path*"

  ]


};