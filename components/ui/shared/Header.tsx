import { SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import NavItems from './NavItems';
import { MobileNav } from './MobileNav';

const Header = () => {
  return (
    <header className="w-full border-b bg-white shadow-md">
      <div className="wrapper flex items-center justify-between p-4">

        <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-3">
          <SignedIn>
            <MobileNav />
            <nav className="hidden md:flex">
              <NavItems />
            </nav>
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
