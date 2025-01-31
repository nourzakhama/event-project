import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t flex-center wrapper flex flex-col gap-4 p-5 text-center sm:flex-row sm:justify-center  text-black dark:bg-black dark:text-white">
      <div className="flex flex-col items-center">
        <Link href="/">
        
          <Image 
            src="/assets/images/logo.svg" 
            alt="logo" 
            width={200} 
            height={60} 
            priority 
          />
        </Link>
        <p className="mt-2 text-center">2024 evently all Rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
