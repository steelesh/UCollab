import Theme from "@components/theme";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
<div className="navbar bg-base-300">
  <div className="flex-1">
    <a href="/" className="p-3 pl-8">
      {/* Replace text with the actual logo image */}
      <img src="/UCollablogo.png" alt="UCollab Logo" className="h-20 w-auto" />
    </a>
  </div>

  <div className="flex-grow justify-end md:hidden">
    {session ? (
      <button onClick={toggleDrawer} className="btn btn-circle btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
    ) : null}
  </div>

      <div className="hidden flex-1 justify-evenly md:flex">
        <Link className="group pt-1.5 text-xl text-accent" href="/explore">
          Explore
          <span className="block h-0.5 max-w-0 bg-primary transition-all duration-500 group-hover:max-w-full"></span>
        </Link>
        <Link className="group pt-1.5 text-xl text-accent" href="/create">
          Create
          <span className="block h-0.5 max-w-0 bg-primary transition-all duration-500 group-hover:max-w-full"></span>
        </Link>
        <Link className="group pt-1.5 text-xl text-accent" href="/community">
          Community
          <span className="block h-0.5 max-w-0 bg-primary transition-all duration-500 group-hover:max-w-full"></span>
        </Link>
      </div>
      <div className="flex-shrink justify-end md:flex-none">
        {session ? (
          <div className="form-control hidden md:flex">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-48 lg:w-auto"
            />
          </div>
        ) : null}
        <div className="mx-4 md:mx-6">
          <Theme />
        </div>
        {session ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar btn btn-circle btn-ghost"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Avatar"
                  src={
                    session.user?.image ??
                    "https://avatar.iran.liara.run/public"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-300 p-2 shadow"
            >
              <li>
                <Link href="/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li>
                <button onClick={() => signOut()}>Sign Out</button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/auth/signin" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </div>
      {session && (
        <div
          className={`fixed right-0 top-0 h-full w-64 transform bg-base-200 p-5 shadow-lg ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          } z-[2] transition-transform duration-300 ease-in-out`}
        >
          <button
            onClick={toggleDrawer}
            className="btn btn-circle btn-ghost absolute right-4 top-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="mt-10 flex flex-col">
            <Link
              className="mb-4 text-xl text-accent"
              href="/explore"
              onClick={toggleDrawer}
            >
              Explore
            </Link>
            <Link
              className="mb-4 text-xl text-accent"
              href="/create"
              onClick={toggleDrawer}
            >
              Create
            </Link>
            <Link
              className="text-xl text-accent"
              href="/community"
              onClick={toggleDrawer}
            >
              Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
