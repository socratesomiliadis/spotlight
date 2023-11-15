import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const params = new URLSearchParams({
        redirect_url: req.nextUrl.pathname,
      });
      const signIn = new URL(`/auth/sign-in?${params}`, req.url);
      return NextResponse.redirect(signIn);
    }

    // redirect them to organization selection page
  },
  publicRoutes: ["/", "/auth(.*)", "/@(.*)"],
  signInUrl: "/auth/sign-in",
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
