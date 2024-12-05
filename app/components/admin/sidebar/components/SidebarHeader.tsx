'use client';
import React from 'react';
import { Typography } from './Typography';
import { Sling as Hamburger } from 'hamburger-react'

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  rtl: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ rtl, collapsed, setCollapsed, ...rest }) => {
  return (
    <div className="h-16 min-h-16 flex items-center px-5" {...rest}>
      <div className="overflow-hidden pl-2 flex items-center cursor-pointer">
        <div className={`flex items-center pr-2 justify-center font-bold ${rtl ? 'ml-2 mr-1' : 'mr-2 ml-1'}`}>
          <Hamburger
            size={22}
            toggled={!collapsed}
            toggle={() => setCollapsed(!collapsed)}
          />
        </div>
        {!collapsed && (
          <Typography variant="subtitle1" fontWeight={600} color="#0098e5">
            Laboratory
          </Typography>
        )}
      </div>
    </div>
  );
};
