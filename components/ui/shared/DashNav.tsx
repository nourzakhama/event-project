'use client';
import { DheaderLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const DashNav = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white h-full p-4">
      <ul className="flex flex-col gap-4">
        {DheaderLinks.map((link) => {
          const isActive = pathname === link.route;

          return (
            <li
              key={link.route}
              className={`whitespace-nowrap py-2 px-4 rounded-md ${
                isActive
                  ? 'custom-link text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Link href={link.route}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
export default DashNav;