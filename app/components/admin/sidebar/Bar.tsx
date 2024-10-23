import React, { useState } from 'react';
import { ChevronRight, Menu, X, User, FileText, Edit3, Beaker, Settings, Package, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

type BarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  setActiveComponent: (component: string) => void;
};

const Bar = ({ collapsed, onToggleCollapse, setActiveComponent }: BarProps) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const sidebarItems = [
    { icon: User, label: 'Patient Registration', route: 'PatientRegister' },
    { icon: FileText, label: 'Patient List', route: 'PatientList' },
    { icon: Edit3, label: 'Patient Report', route: 'PatientReport' },
    {
      icon: Beaker,
      label: 'Tests',
      subItems: [
        { label: 'Test List', route: 'TestList' },
        { label: 'Packages', route: 'Packages' },
      ],
    },
    {
      icon: Settings,
      label: 'Lab Management',
      subItems: [
        { label: 'Organization', route: 'Organization' },
        { label: 'Manage Users', route: 'ManageUsers' },
        { label: 'Lab Center', route: 'LabCenter' },
      ],
    },
    {
      icon: Package,
      label: 'Inventory',
      subItems: [
        { label: 'Dashboard', route: 'InventoryDashboard' },
        { label: 'Current Stock', route: 'CurrentStock' },
        { label: 'Purchase Order', route: 'PurchaseOrder' },
      ],
    },
    { icon: UserCheck, label: 'Lab Profile', route: 'LabProfile' },
  ];

  const toggleMenu = (menu: string) => {
    if (!collapsed) {
      setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    }
  };

  const handleItemClick = (route: string) => {
    setActiveComponent(route);
    router.push(`/admin?component=${route}`);
  };

  return (
    <div className={`bg-white border-r text-black transition-all duration-300 h-full ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        {!collapsed && <h1 className="text-xl font-semibold text-gray-800">flabs</h1>}
        <button 
          onClick={onToggleCollapse} 
          className="p-1 rounded-full hover:bg-gray-200"
        >
          {collapsed ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
        </button>
      </div>
      <nav className="p-4">
        {sidebarItems.map((item, index) => (
          <div key={index} className="mb-2">
            <div
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg cursor-pointer group relative"
              onClick={() => item.route ? handleItemClick(item.route) : toggleMenu(item.label)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.subItems && (
                    <ChevronRight className={`ml-auto ${openMenus[item.label] ? 'rotate-90' : ''}`} />
                  )}
                </>
              )}
              {collapsed && (
                <span className="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.label}
                </span>
              )}
            </div>
            {!collapsed && item.subItems && openMenus[item.label] && (
              <div className="ml-6 mt-2">
                {item.subItems.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                    onClick={() => handleItemClick(subItem.route)}
                  >
                    {subItem.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Bar;
