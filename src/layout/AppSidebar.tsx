import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Book,
  CircleGauge,
  HelpCircle,
  HomeIcon,
  Pill,
  WandSparkles,
  Search,
  SearchCheckIcon,
  SearchCode,
  SearchSlashIcon,
  History,
  Archive,
  LayoutDashboard,
  LayoutPanelTop,
  LayoutPanelLeft,
} from "lucide-react";

const SearchIcon = Search;

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { UserIcon } from "../icons";

import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import AboutUs from "../old/about";
import Services from "../old/services";
import Home from "../pages/Dashboard/Home";
import { FaSync } from "react-icons/fa";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  pro?: boolean;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    icon?: React.ReactNode;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Home", path: "/", pro: false, icon: <HomeIcon /> }],
  },
  {
    name: "Search",
    icon: <SearchIcon />,
    subItems: [
      {
        name: "Search by Drug",
        path: "/search/1",
        pro: false,
        icon: <SearchCheckIcon />,
      },
      {
        name: "Search by Insurance",
        path: "/search/2",
        pro: false,
        icon: <SearchCode />,
      },
      {
        name: "Search by Drug Class",
        path: "/search/4",
        pro: false,
        icon: <SearchCode />,
      },
      {
        name: "Search by Rx Group",
        path: "/search/3",
        pro: false,
        icon: <SearchSlashIcon />,
      },
    ],
  },
  {
    name: "Audits",
    icon: <ListIcon />,
    subItems: [
      {
        name: "All Scripts Audit Dashboard",
        path: "/dashboard/1",
        pro: false,
        icon: <LayoutDashboard />,
      },
      {
        name: "Scripts matched Medisearch tool output Audit Dashboard",
        path: "/dashboard/2",
        pro: false,
        icon: <LayoutPanelTop />,
      },
      {
        name: "Scripts mismatched Medisearch tool output Audit Dashboard",
        path: "/dashboard/3",
        pro: false,
        icon: <LayoutPanelLeft />,
      },
      { name: "Users Logs", path: "/logs", pro: false, icon: <Archive /> },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <Book />,
    name: "About",
    path: "/about",
    pro: false,
  },
  {
    name: "Services",
    path: "/services",
    pro: false,
    icon: <WandSparkles />,
  },
  {
    name: "Sync New Data",
    path: "/SyncData",
    pro: false,
    icon: <FaSync />,
  },
  {
    name: "Help & Support",
    path: "/help",
    pro: false,
    icon: <HelpCircle />,
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-0.5">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group cursor-pointer ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              } ${
                isExpanded || isHovered
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <span
                className={`menu-item-icon-size flex items-center justify-center min-w-[44px] min-h-[44px] ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span
                  className={`menu-item-text flex items-center min-w-[44px] min-h-[44px]`}
                >
                  {nav.name}
                </span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size flex items-center justify-center min-w-[44px] min-h-[44px] ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span
                    className={`menu-item-text flex items-center justify-center min-w-[44px] min-h-[44px] ${
                      isActive(nav.path)
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {subItem.icon && (
                        <span className="mr-2">{subItem.icon}</span>
                      )}
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 z-99999 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out  border-r border-gray-200 
      ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      }
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar Header */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {(isExpanded || isHovered || isMobileOpen) && (
            <span
              className="flex items-center text-2xl font-extrabold tracking-wide text-blue-600 dark:text-blue-400"
              style={{ minWidth: "44px", minHeight: "44px" }} // Ensure minimum size
            >
              Medsearch
              <Pill
                className="ml-2 w-6 h-6 text-blue-600 dark:text-blue-400"
                style={{ minWidth: "44px", minHeight: "44px" }} // Ensure minimum size for the icon
              />
            </span>
          )}
        </Link>
      </div>

      {/* Sidebar Content */}
      {/* Sidebar Content */}
      <div className="flex flex-col h-full overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 flex-grow">
          <div className="flex flex-col gap-4">
            {/* Main Menu */}
            <div>
              <h1
                className={`mb-4 text-xs uppercase flex leading-[20px] ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                } text-gray-600 dark:text-gray-300`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h1>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Other Menu */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                } text-gray-600 dark:text-gray-300`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Other"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>

        {/* Sidebar Widget */}
        {(isExpanded || isHovered || isMobileOpen) && (
          <div className="mt-auto w-[calc(100%-32px)] mb-4 mx-4">
            <SidebarWidget />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
