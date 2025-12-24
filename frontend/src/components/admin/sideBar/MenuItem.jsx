import React from "react";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { NavLink } from "react-router-dom";

function MenuItem({ item, pathname, setSidebarExpanded }) {
  const isActive = item.path 
    ? pathname === item.path || pathname.includes(item.id)
    : pathname.includes(item.id);

  // Menu item có submenu
  if (item.children) {
    return (
      <SidebarLinkGroup activeCondition={isActive}>
        {(handleClick, open) => (
          <React.Fragment>
            <a
              href="#0"
              className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                isActive ? "" : "hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleClick();
                setSidebarExpanded(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <item.icon className={isActive ? "text-violet-500" : ""} />
                  <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    {item.label}
                  </span>
                </div>
                <div className="flex shrink-0 ml-2">
                  <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </div>
              </div>
            </a>
            <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
              <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                {item.children.map((child, idx) => (
                  <li key={idx} className="mb-1 last:mb-0">
                    <NavLink
                      end
                      to={child.path}
                      className={({ isActive }) =>
                        "block transition duration-150 truncate " + 
                        (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                      }
                    >
                      <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        {child.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </React.Fragment>
        )}
      </SidebarLinkGroup>
    );
  }

  // Menu item đơn giản (không có submenu)
  return (
    <li className={`pl-4 pr-3 py-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r ${isActive && 'from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]'}`}>
      <NavLink
        end
        to={item.path}
        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
          isActive ? "" : "hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="grow flex items-center">
            <item.icon className={isActive ? "text-violet-500" : ""} />
            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              {item.label}
            </span>
          </div>
          {item.badge && (
            <div className="flex shrink-0 ml-2">
              <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-violet-400 px-2 rounded-sm">
                {item.badge}
              </span>
            </div>
          )}
        </div>
      </NavLink>
    </li>
  );
}

export default MenuItem;