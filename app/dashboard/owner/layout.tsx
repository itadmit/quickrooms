"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  AlertCircle, 
  LogOut, 
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  Settings
} from "lucide-react";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const menuItems = [
    { href: "/dashboard/owner", label: "סקירה כללית", icon: LayoutDashboard },
    { href: "/dashboard/owner/spaces", label: "ניהול מתחמים", icon: Building2 },
    { href: "/dashboard/owner/members", label: "חברי קהילה", icon: Users },
    { href: "/dashboard/owner/bookings", label: "יומן הזמנות", icon: Calendar },
    { href: "/dashboard/owner/credit-plans", label: "חבילות קרדיט", icon: CreditCard },
    { href: "/dashboard/owner/reports", label: "דוחות ונתונים", icon: BarChart3 },
    { href: "/dashboard/owner/overuse-payments", label: "תשלומי חריגה", icon: AlertCircle },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/owner" && pathname === "/dashboard/owner") return true;
    if (path !== "/dashboard/owner" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Logo />
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            תפריט ראשי
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? "bg-[#e0e7ff] text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            התנתק
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm z-20">
          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo className="scale-75" />
          </div>

          {/* Left Side: Search (Desktop) */}
          <div className="hidden lg:flex items-center w-96 relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3" />
            <input 
              type="text" 
              placeholder="חיפוש מתחמים, הזמנות או חברים..." 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Right Side: Actions & Profile */}
          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-200">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Owner Demo</div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  ></div>
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-40">
                    <Link
                      href="/dashboard/owner/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      הגדרות מערכת
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <Link
                      href="/api/auth/logout"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      התנתק
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-[#F5F6F8]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
