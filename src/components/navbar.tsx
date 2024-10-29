import Theme from "@components/theme";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar bg-base-300 p-3">
      <div className="flex-1">
        <Link href="/" className="text-5xl font-bold">
          <span className="inline-block origin-center transform transition-transform duration-300 hover:scale-105">
            <span className="text-primary">UC</span>
            <span className="text-accent">ollab</span>
          </span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="mx-4">
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
    </nav>
  );
}
