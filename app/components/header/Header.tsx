import React from 'react';
import { Search, HelpCircle, Settings, ChevronDown } from 'lucide-react';

export default function HeaderNav() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 flex-wrap">
      <div className="flex items-center space-x-4 w-full md:w-auto mb-4 md:mb-0">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center">
          <span className="font-light mr-1">Lab</span>Quik
        </h1>
        
        <form role="search" className="relative flex-grow  md:flex-grow-0">
          <label htmlFor="patient-search" className="sr-only">Search patient</label>
          <input
            id="patient-search"
            type="search"
            placeholder="Search patient"
            className="w-full md:w-[200px] lg:w-[300px] h-10 pl-4 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        </form>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 flex-wrap justify-end w-full md:w-auto">
        <button className="flex items-center border rounded-lg px-2 md:px-3 py-1 md:py-2 hover:bg-gray-50 text-sm" aria-label="Select location">
          <span className="mr-1 md:mr-2">Salar</span>
          <ChevronDown className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
        </button>

        <button className="flex items-center space-x-1 md:space-x-2 text-sm" aria-label="User profile">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xs md:text-sm">A</span>
          </div>
          <span className="hidden md:inline">Arsalan</span>
          <ChevronDown className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
        </button>

        <button className="flex items-center space-x-1 text-purple-600 border border-purple-200 rounded-lg px-2 md:px-3 py-1 md:py-2 hover:bg-purple-50 text-sm">
          <HelpCircle className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
          <span className="hidden md:inline">Help</span>
        </button>

        <button className="p-1 md:p-2 hover:bg-gray-100 rounded-lg" aria-label="Settings">
          <Settings className="h-4 w-4 md:h-5 md:w-5 text-gray-600" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
