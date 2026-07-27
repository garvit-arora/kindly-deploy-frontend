import { NavLink, Link } from "react-router-dom";
import logo from "../../public/logo-wo-bg.png";
import {
  Folder,
  Box,
  Rocket,
  Terminal,
  KeyRound,
  Globe,
  Settings,
  Boxes,
  NotepadTextDashed,
  BoxIcon,
  List,
  BookLock,
} from "lucide-react";

const navItems = [
  {
    name: "Projects",
    path: "/dashboard/projects",
    icon: Boxes,
  },
  {
    name: "Blueprints",
    path: "/dashboard/blueprints",
    icon: NotepadTextDashed,
  },
  {
    name: "Deployments",
    path: "/dashboard/deployments",
    icon: BoxIcon,
  },
  {
    name: "Log Stream",
    path: "/dashboard/logs",
    icon: List,
  },
  {
    name: "Environment Variables",
    path: "/dashboard/environment-variables",
    icon: BookLock,
  },
  {
    name: "Domains",
    path: "/dashboard/domains",
    icon: Globe,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar({user}) {
  return (
    <aside className="flex w-64 min-h-screen border-r bg-[#141414]">
      <div className="flex flex-col justify-between">
        <div className="flex w-full flex-col gap-6 p-4">
          <div className="flex flex-row gap-2">
            <img src={logo} className="h-14 w-14 object-contain" alt="Logo" />
            <p className="text-2xl">
              KINDLY <br /> DEPLOY
            </p>
          </div>

          <nav>
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/dashboard/projects"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 transition ${
                          isActive
                            ? "bg-[#48008c] font-semibold"
                            : "text-amber-50 hover:bg-[#403f3f] hover:rounded-none focus:bg-[#48008c]"
                        }`
                      }>
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div>
          <div className="mt-auto border-t border-gray-700 p-4">
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-3 rounded-md p-2 transition hover:bg-[#403f3f]">
              <img
                src={user?.avatarUrl||'/default-avatar.png'}
                alt={user?.name||"Profile"}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <span className="font-semibold text-amber-50">
                  {user?.name|| "Github User"}
                </span>
                <span className="text-sm text-gray-400">View Profile</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
