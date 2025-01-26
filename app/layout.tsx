import type { Metadata } from "next";
import {Poppins} from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";


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
            className={poppins.variable}
          >
            {children}
          </body>
        </html>
    </ClerkProvider>
  );
}
