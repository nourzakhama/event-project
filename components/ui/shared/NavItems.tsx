'use client';
import { headerLinks, UheaderLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const NavItems = () => {
  const pathname = usePathname();
  const { userId } = useAuth(); 
  const list = userId?.trim() === "user_2sBmGAUuBUG2ghzUgMFnpQYXEOz" || userId?.trim() === "user_2qCwNSfYMqeA1Mwsgko0HCklpQz" ? headerLinks : UheaderLinks;

  return (
    <nav>
      <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row custom-list">
        {list.map((link) => {
          const isActive = pathname === link.route;
          return (
            <li
            key={link.route}
            className={`flex-center p-medium-16 whitespace-nowrap ${
              isActive ? 'custom-link' :""
            }`}
          >
              <Link href={link.route} >{link.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavItems;