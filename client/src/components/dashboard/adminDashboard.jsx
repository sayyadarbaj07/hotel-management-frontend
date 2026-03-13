import { useAuth } from "../context/authContext";
import { LogIn, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-10 space-y-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Overview of your hotel's performance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
        <div className="bg-white p-8 rounded-xl shadow border border-gray-50 group transition-all">
          <p className="text-gray-500 text-sm">Active bookings</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-bold text-gray-900 leading-none">85%</h2>
            <span className="text-xs font-semibold text-green-500 uppercase">+5%</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow border border-gray-50 group transition-all">
          <p className="text-gray-500 text-sm">Room occupancy</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-bold text-gray-900 leading-none">65%</h2>
            <span className="text-xs font-semibold text-red-500 uppercase">-10%</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow border border-gray-50 group transition-all">
          <p className="text-gray-500 text-sm">Guest satisfaction</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-bold text-gray-900 leading-none">4.7/5</h2>
            <span className="text-xs font-semibold text-green-500 uppercase">+7%</span>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Table */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow p-6 border border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
            <h3 className="font-semibold text-xl text-gray-800 tracking-tight">
              New Booking
            </h3>
            <button className="text-sm text-purple-600 font-medium hover:underline transition-all">
              View All
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-50">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="px-4">Guest</th>
                  <th className="px-4">Room</th>
                  <th className="px-4">Type</th>
                  <th className="px-4">Check In</th>
                  <th className="px-4">Check Out</th>
                  <th className="px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { id: "#1223", user: "Alex Trie", room: "S-01", type: "Single", checkin: "Jan 21", checkout: "Jan 26", status: "New", color: "text-blue-600 bg-blue-100" },
                  { id: "#1224", user: "Annette Black", room: "S-22", type: "Single", checkin: "Jan 08", checkout: "Jan 20", status: "Checked In", color: "text-yellow-600 bg-yellow-100" },
                  { id: "#1225", user: "Jerome Bell", room: "D-08", type: "Double", checkin: "Jan 13", checkout: "Jan 21", status: "Confirmed", color: "text-green-600 bg-green-100" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-700">{row.id}</td>
                    <td className="px-4">{row.user}</td>
                    <td className="px-4">{row.room}</td>
                    <td className="px-4">{row.type}</td>
                    <td className="px-4">{row.checkin}</td>
                    <td className="px-4">{row.checkout}</td>
                    <td className="px-4 text-center">
                      <span className={`${row.color} px-2 py-1 rounded text-xs font-medium`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-4 space-y-10">
          {/* Booking Overview */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">Booking Overview</h3>
              <select className="text-sm border rounded px-2 py-1">
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>
            <div className="flex items-end justify-between h-40 gap-4">
              {[
                { month: "Jan", value: 455, height: "h-32", color: "bg-black" },
                { month: "Feb", value: 409, height: "h-24", color: "bg-pink-500" },
                { month: "Mar", value: 222, height: "h-16", color: "bg-purple-300" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <p className="text-xs font-semibold mb-1">
                    {item.value}
                  </p>
                  <div className={`${item.color} w-full ${item.height} rounded-t-lg`}></div>
                  <p className="text-xs mt-2 text-gray-500">
                    {item.month}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-50">
            <h3 className="font-semibold text-lg mb-6">Top Category</h3>
            <div className="flex flex-wrap justify-center items-center gap-6">
              {[
                { label: "Double room", value: "56%", color: "bg-black", size: "w-24 h-24" },
                { label: "Single room", value: "30%", color: "bg-purple-400", size: "w-20 h-20" },
                { label: "Deluxe room", value: "14%", color: "bg-gray-200", size: "w-16 h-16", textColor: "text-gray-900" }
              ].map((cat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`${cat.size} ${cat.color} ${cat.textColor || 'text-white'} flex items-center justify-center rounded-full font-semibold text-sm`}>
                    {cat.value}
                  </div>
                  <p className="text-xs mt-2 text-gray-500">
                    {cat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
