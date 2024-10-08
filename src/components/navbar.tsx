import Theme from "../components/theme";

export default function Navbar() {
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <a className="p-3 pl-8 text-5xl font-bold">
          <span className="inline-block origin-center transform transition-transform duration-300 hover:scale-110">
            <span className="text-[#E00222]">UC</span>
            <span className="text-white">ollab</span>
          </span>
        </a>
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
        <div className="dropdown dropdown-end mr-4">
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
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
