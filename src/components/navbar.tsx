'use client';

import Theme from '@components/theme';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import SignInButton from '~/components/signin-button';

export default function Navbar() {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <nav className="navbar bg-base-300 p-3 select-none">
      <div className="flex-shrink">
        <Link href="/" className="text-5xl font-bold">
          <span className="inline-block origin-center transform transition-transform duration-300 hover:scale-105">
            <span className="text-primary-content">UC</span>
            <span className="text-accent-content">ollab</span>
          </span>
        </Link>
      </div>
      <div className="flex-grow justify-end md:hidden">
        {session ? (
          <button onClick={toggleDrawer} className="btn btn-circle btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        ) : null}
      </div>
      {session ? (
        <div className="hidden flex-1 justify-evenly md:flex">
          <Link className="group text-accent-content pt-1.5 text-xl" href="/explore">
            Explore
            <span className="bg-primary-content block h-0.5 max-w-0 transition-all duration-500 group-hover:max-w-full"></span>
          </Link>
          <Link className="group text-accent-content pt-1.5 text-xl" href="/create">
            Create
            <span className="bg-primary-content block h-0.5 max-w-0 transition-all duration-500 group-hover:max-w-full"></span>
          </Link>
          <Link className="group text-accent-content pt-1.5 text-xl" href="/community">
            Community
            <span className="bg-primary-content block h-0.5 max-w-0 transition-all duration-500 group-hover:max-w-full"></span>
          </Link>
        </div>
      ) : (
        <div className="hidden flex-1 justify-evenly md:flex">
          <Link className="group text-accent-content pt-1.5 text-xl" href="/#">
            Explore
            <span className="bg-primary-content block h-0.5 max-w-0 transition-all duration-500 group-hover:max-w-full"></span>
          </Link>
          <Link className="group text-accent-content pt-1.5 text-xl" href="/#">
            Create
            <span className="bg-primary-content block h-0.5 max-w-0 transition-all duration-500 group-hover:max-w-full"></span>
          </Link>
          <Link className="group text-accent-content pt-1.5 text-xl" href="/#">
            Community
            <span className="bg-primary-content block h-0.5 max-w-0 transition-all duration-500 group-hover:max-w-full"></span>
          </Link>
        </div>
      )}
      <div className="flex-shrink justify-end md:flex-none">
        <div className="flex items-center gap-4">
          {session ? (
            <div className="form-control hidden md:flex">
              <input type="text" placeholder="Search" className="input input-bordered w-48 lg:w-auto" />
            </div>
          ) : (
            <div>
              <SignInButton />
            </div>
          )}
          <Theme />
          {session ? (
            <Link href={`/${session.user.username}`}>
              <div className="avatar btn btn-circle btn-ghost">
                <div className="w-10 rounded-full">
                  <img alt="Avatar" src={session.user.avatar ?? 'https://avatar.iran.liara.run/public'} />
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
      {session && (
        <div
          className={`bg-base-200 fixed top-0 right-0 h-full w-64 transform p-5 shadow-lg ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          } z-[2] transition-transform duration-300 ease-in-out`}>
          <button onClick={toggleDrawer} className="btn btn-circle btn-ghost absolute top-4 right-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="mt-10 flex flex-col">
            <Link className="text-accent mb-4 text-xl" href="/explore" onClick={toggleDrawer}>
              Explore
            </Link>
            <Link className="text-accent mb-4 text-xl" href="/create" onClick={toggleDrawer}>
              Create
            </Link>
            <Link className="text-accent text-xl" href="/community" onClick={toggleDrawer}>
              Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
