// import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from "next";
import {Poppins} from "next/font/google";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/shared/ThemeProvider";


const poppins=({
  subsets:['latin'],
  weight:['400','500','600','700'],
  variable:'--font-poppins',

})

export const metadata: Metadata = {
  title: "evently",
  description: "event management",
  icons:{
    icon:'/assets/images/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
        <html lang="en">
          
          <body
            className={poppins.variable + "  text-black dark:bg-black dark:text-white"}
          ><ThemeProvider   attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
           <div className="min-h-screen  text-black dark:bg-black dark:text-white"> {children}</div>
            </ThemeProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}
