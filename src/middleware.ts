import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
const isProtectedRoute = createRouteMatcher(['/', '/api/webhook']);
export default clerkMiddleware( async (auth,req) =>{
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
