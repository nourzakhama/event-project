import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ModeToggle } from '@/components/ui/shared/ThemeTriger';
import NavItems from './NavItems';
import { MobileNav } from './MobileNav';

const Header = () => {
  return (
    <header className="w-full border-b text-black dark:bg-black dark:text-white shadow-md">
      <div className="wrapper flex items-center justify-between p-4  ">

        <div className="flex items-center gap-4  text-black dark:bg-black dark:text-white">
        <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <Link href="/" className="w-35">
            <Image 
            src="/assets/images/logo.svg"
              width={128} 
              height={38} 
              alt="Event Management Logo" 
            />
          </Link>
        </div>

        <div className="flex items-center gap-3  text-black dark:bg-black dark:text-white">
          <SignedIn>
            <MobileNav />
            <nav className="hidden md:flex  text-black dark:bg-black dark:text-white">
              <NavItems />
            </nav>
            <div className="flex justify-end"><ModeToggle/></div>
            
          </SignedIn>

          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">sign-in</Link>
            </Button>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-up">sign-up</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
