import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes using createRouteMatcher
const isPublicRoute = createRouteMatcher([
  '/',                     // Home page
  '/sign-in(.*)',          // Sign-in page and any sub-routes
  '/sign-up(.*)',          // Sign-up page and any sub-routes
  '/api/webhook/clerk',    // Clerk webhook
  '/events/:id',           // Event details page
  '/api/webhook/stripe',   // Stripe webhook
  '/api/uploadthing'       // Uploadthing API
]);

export default clerkMiddleware((auth, req) => {
  // Allow access to public routes
  if (isPublicRoute(req)) {
    return; // No authentication required
  }

  // Protect all other routes
  auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};