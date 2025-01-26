import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Create a matcher for public routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware({
  publicRoutes: [
    '/',     
    '/api/webhook/clerk',                 
    '/events/:id',           
    '/api/webhook/stripe',     
    '/api/uploadthing'        
  ],
  ignoredRoutes: [
    '/api/webhook/clerk',      
    '/api/webhook/stripe',
    '/api/uploadthing'
  ]
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
