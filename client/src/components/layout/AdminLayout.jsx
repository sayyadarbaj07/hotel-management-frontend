import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search, Mail, Bell, User, LogOut } from "lucide-react";
import { useAuth } from "../context/authContext";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", roles: ["admin", "receptionist", "housekeeping"] },
    { label: "Users", path: "/admin/users", roles: ["admin"] },
    { label: "Rooms", path: "/admin/rooms", roles: ["admin", "receptionist", "housekeeping"] },
    { label: "RoomsType", path: "/admin/room-types", roles: ["admin"] },
    { label: "StatusBoard", path: "/admin/rooms/status-board", roles: ["admin", "receptionist", "housekeeping"] },
    { label: "Guests", path: "/admin/guests", roles: ["admin", "receptionist"] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const isActive = (path) => {
    if (path === "/admin/rooms") {
        return location.pathname === "/admin/rooms" || (location.pathname.startsWith("/admin/rooms/") && location.pathname !== "/admin/rooms/status-board");
    }
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6 font-sans">
      {/* Navbar */}
      <div className="bg-gradient-to-r from-[#0c1028] to-[#1a2048] rounded-2xl p-4 md:p-8 text-white shadow-2xl mb-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="text-xl">🏨</span>
             </div>
             <h2 className="text-2xl font-black tracking-tighter italic">
                INNTEGRATE
             </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full lg:w-auto order-3 lg:order-2">
            {filteredNav.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive(item.path)
                    ? "bg-white text-[#0c1028] shadow-lg scale-105"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5 order-2 lg:order-3">
            <div className="hidden sm:flex items-center gap-4 text-white/60">
                <Search size={20} className="hover:text-white cursor-pointer transition-colors" />
                <Mail size={20} className="hover:text-white cursor-pointer transition-colors" />
                <Bell size={20} className="hover:text-white cursor-pointer transition-colors" />
            </div>
            
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-3 bg-white/10 p-1.5 pr-4 rounded-full border border-white/10 hover:bg-white/20 transition-all cursor-pointer group">
              <div className="bg-gradient-to-tr from-purple-500 to-indigo-500 p-2 rounded-full shadow-inner">
                <User size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none">{user?.name}</span>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-0.5">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="ml-2 p-1.5 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-400 transition-colors">
                  <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mt-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {getTimeGreeting()}, <span className="text-purple-400">{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p className="text-white/50 text-sm mt-2 font-medium">Welcome back to your command center. Everything looks good today.</p>
          </div>

          <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-2xl text-sm w-full md:w-auto transition-all shadow-lg shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-2">
            <span className="text-lg">+</span> New reservation
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="animate-in fade-in duration-500">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
