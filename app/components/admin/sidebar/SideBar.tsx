"use client";
import React, { useState, ReactNode } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
  MenuItemStyles,
} from "react-pro-sidebar";
import { SidebarHeader } from "./components/SidebarHeader";
import { Badge } from "./components/Badge";
import {
  UserRoundPlus,
  FlaskConical,
  Users,
  ScrollText,
  UserRoundPen,
  FileCheck2,
  Package,
  Gauge,
} from "lucide-react";
import { useFloating, offset, shift, flip, arrow, useHover, useInteractions, FloatingPortal } from '@floating-ui/react';


type Theme = "light" | "dark";

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#c5e4ff",
        color: "#44596e",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#0b2948",
      color: "#8ba1b7",
    },
    menu: {
      menuContent: "#082440",
      icon: "#59d0ff",
      hover: {
        backgroundColor: "#00458b",
        color: "#b6c8d9",
      },
      disabled: {
        color: "#3e5e7e",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface PlaygroundProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

interface MenuItemWithTooltipProps {
  icon: ReactNode;
  children: ReactNode;
  collapsed: boolean;
  onClick: () => void;
  isActive: boolean;
}

const MenuItemWithTooltip = ({ icon, children, collapsed, onClick, isActive }: MenuItemWithTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {x, y, strategy, refs, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    placement: 'right',
  });

  const hover = useHover(context);
  const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

  return (
    <MenuItem
      icon={icon}
      onClick={onClick}
      ref={refs.setReference}
      {...getReferenceProps()}
      className={isActive ? 'bg-blue-100 dark:bg-blue-900' : ''}
    >
      {children}
      {collapsed && (
        <FloatingPortal>
          {isOpen && (
            <div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                zIndex: 9999,
              }}
              {...getFloatingProps()}
            >
              <div className="bg-gray-800 text-white px-2 py-1 rounded text-sm">
                {children}
              </div>
            </div>
          )}
        </FloatingPortal>
      )}
    </MenuItem>
  );
};

export const Playground: React.FC<PlaygroundProps> = ({ collapsed, setCollapsed, setActiveComponent, activeComponent }) => {
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("light");
 // const { user } = useSelector((state: any) => state.auth);

  // handle on RTL change event
  const handleRTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRtl(e.target.checked);
  };

  // handle on theme change event
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  // handle on image change event
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasImage(e.target.checked);
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(
              themes[theme].menu.menuContent,
              hasImage && !collapsed ? 0.4 : 1
            )
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          hasImage ? 0.8 : 1
        ),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <Sidebar
      collapsed={collapsed}
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      onBreakPoint={setBroken}
      rtl={rtl}
      className="h-full rounded-lg dark:border-[#3b3b3bd2] transition-all duration-300"
      rootStyles={{
        color: themes[theme].sidebar.color,
        width: collapsed ? '80px' : '240px', // Adjust width based on collapsed state
      }}
    >
      <nav className="flex dark:bg-[#111c43] flex-col h-full">
        <div className="flex-1 mb-8">
          <SidebarHeader
            rtl={rtl}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            className="pb-6 mt-4"
          /> 

          <Menu menuItemStyles={menuItemStyles}>
            <MenuItemWithTooltip
              icon={<UserRoundPlus aria-hidden="true" />}
              collapsed={collapsed}
              onClick={() => setActiveComponent('PatientRegister')}
              isActive={activeComponent === 'PatientRegister'}
            >
              Patient Registration
            </MenuItemWithTooltip>
            <MenuItemWithTooltip
              icon={<ScrollText />}
              collapsed={collapsed}
              onClick={() => setActiveComponent('PatientList')}
              isActive={activeComponent === 'PatientList'}
            >
              Patient List
            </MenuItemWithTooltip>
            <MenuItemWithTooltip
              icon={<FileCheck2 />}
              collapsed={collapsed}
              onClick={() => setActiveComponent('PatientReport')}
              isActive={activeComponent === 'PatientReport'}
            >
              Patient Report
            </MenuItemWithTooltip>
            <SubMenu
              label="Tests"
              icon={<FlaskConical />}
              defaultOpen={activeComponent.startsWith('Test')}
            >
              <MenuItem 
                className={`dark:bg-[#162149] ${activeComponent === 'TestList' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                onClick={() => setActiveComponent('TestList')}
              > 
                Test List
              </MenuItem>
              <MenuItem className="dark:bg-[#162149]"> Packages</MenuItem>
              <MenuItem className="dark:bg-[#162149]" suffix={<Badge variant="success">Pro</Badge>}> Outsource</MenuItem>
            </SubMenu>
            <SubMenu
              label="Lab Management"
              icon={<Users />}
              title="Lab Management"
              
            >
              <MenuItem className="dark:bg-[#162149]"> Organization</MenuItem>
              <MenuItem className="dark:bg-[#162149]"> Manage Users</MenuItem>
              <MenuItem className="dark:bg-[#162149]"> Lab Ceter</MenuItem>
            </SubMenu>
            <SubMenu
              label="Inventory"
              icon={<Package />}
              title="Inventory"
              
            >
              <MenuItem className="dark:bg-[#162149]"> Dashboard</MenuItem>
              <MenuItem className="dark:bg-[#162149]"> Current Stock</MenuItem>
              <MenuItem className="dark:bg-[#162149]"> Purchase Order</MenuItem>
            </SubMenu>
            <MenuItem
              icon={<UserRoundPen />}
            >
              Lab Profile
            </MenuItem>
          </Menu>
        </div>
      </nav>
    </Sidebar>
  );
};

export default Playground;
