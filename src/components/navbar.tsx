import Theme from "@components/theme";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <nav className="navbar bg-base-300 p-3">

      <div className="flex-shrink">
        <Link href="/" className="text-5xl font-bold">
          <span className="inline-block origin-center transform transition-transform duration-300 hover:scale-105">
            <span className="text-primary">UC</span>
            <span className="text-accent">ollab</span>
          </span>
        </Link>
      </div>

      <div className="md:hidden flex-grow justify-end">
        <button onClick={toggleDrawer} className="btn btn-ghost btn-circle">
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
      </div>

      <div className="hidden md:flex flex-1 justify-evenly">
        <Link className="group text-xl text-accent pt-1.5" href="/explore">
          Explore
          <span
            className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"
          ></span>
        </Link>
        <Link className="group text-xl text-accent pt-1.5" href="/create">
          Create
          <span
            className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"
          ></span>
        </Link>
        <Link className="group text-xl text-accent pt-1.5" href="/community">
          Community
          <span
            className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary"
          ></span>
        </Link>
      </div>

      <div className="flex-shrink md:flex-none justify-end">
        <div className="form-control hidden md:flex">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-48 lg:w-auto"
          />
        </div>
        <div className="mx-4 md:mx-6">
          <Theme />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="avatar btn btn-circle btn-ghost"
          >
            <div className="w-10 rounded-full">
              <img alt="Avatar" src="https://avatar.iran.liara.run/public" />
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
              <Link href="#">Logout</Link>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-base-200 p-5 shadow-lg transform ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-[2]`}
      >
        <button
          onClick={toggleDrawer}
          className="btn btn-ghost btn-circle absolute top-4 right-4"
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
        <div className="flex flex-col mt-10">
          <Link
            className="text-xl text-accent mb-4"
            href="/explore"
            onClick={toggleDrawer}
          >
            Explore
          </Link>
          <Link
            className="text-xl text-accent mb-4"
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
    </nav>
  );
}
