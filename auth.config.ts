import type { NextAuthConfig } from 'next-auth';
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    //
    authorized({ auth, request: { nextUrl } }) {
    //authorized回调用于验证请求是否有权通过Next.js中间件访问页面，
    //在请求完成之前被调用，并接收具有auth和request属性的对象。
    //auth属性包含user的session，request属性包含incoming request。
      const isLoggedIn = !!auth?.user;
    //将
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  //providers是一个数组，您可以在其中列出不同的登录选项
  providers: [
    google({
      clientId:process.env.GOOGLE_CLIENT_ID!, 
      clientSecret:process.env.GOOGLE_CLIENT_SECRET!, 
  }),
    github({
      clientId:process.env.GITHUB_ID!,
      clientSecret:process.env.GITHUB_SECRET!,
  })
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;