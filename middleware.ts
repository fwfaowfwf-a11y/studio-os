import {
  NextResponse
} from "next/server";


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

  if(

    pathname === "/login"

    &&

    user

  ){

    return NextResponse.redirect(

      new URL(
        "/tasks",
        request.url
      )

    );

  }






  // =====================
  // 任务页面
  // =====================

  if(

    pathname.startsWith(
      "/tasks"
    )

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







  // =====================
  // 管理后台
  // =====================

  if(

    pathname.startsWith(
      "/admin"
    )

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

    "/tasks/:path*",

    "/admin/:path*"

  ]


};