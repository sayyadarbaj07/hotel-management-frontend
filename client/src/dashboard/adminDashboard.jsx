import React from "react";
import {
  Search,
  Bell,
  Mail,
  User,
  LogIn,
  LogOut
} from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">

      {/* Navbar */}

      <div className="bg-gradient-to-r from-[#0c1028] to-[#1a2048] rounded-xl p-4 md:p-6 text-white mb-6">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <h2 className="text-lg font-semibold">
            Inntegrate
          </h2>

          {/* Menu */}

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm w-full md:w-auto">

            <button className="bg-white/10 px-4 py-1 rounded-lg">
              Dashboard
            </button>

            <button>Guests</button>
            <button>Reservations</button>
            <button>Rooms</button>
            <button>Restaurant</button>

          </div>

          {/* Icons */}

          <div className="flex items-center gap-4">

            <Search size={18} />
            <Mail size={18} />
            <Bell size={18} />

            <div className="bg-white/20 p-2 rounded-full">
              <User size={16} />
            </div>

          </div>

        </div>

        {/* Greeting */}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">

          <h1 className="text-xl md:text-2xl font-semibold">
            Good morning, Alex!
          </h1>

          <button className="bg-purple-500 px-4 py-2 rounded-lg text-sm w-full md:w-auto">
            + New reservation
          </button>

        </div>

      </div>


      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">

        <div className="bg-green-500 text-white p-6 rounded-xl flex flex-col items-center justify-center gap-2">
          <LogIn size={28}/>
          <p className="text-sm font-medium">Check in</p>
        </div>

       <div className="bg-black text-white p-6 rounded-xl flex flex-col items-center justify-center gap-2">
  <LogOut size={28} className="rotate-180" />
  <p className="text-sm font-medium">Check out</p>
</div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Active bookings</p>
          <h2 className="text-3xl font-bold mt-2">85%</h2>
          <p className="text-green-500 text-sm">+5%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Room occupancy</p>
          <h2 className="text-3xl font-bold mt-2">65%</h2>
          <p className="text-red-500 text-sm">-10%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Guest satisfaction</p>
          <h2 className="text-3xl font-bold mt-2">4.7/5</h2>
          <p className="text-green-500 text-sm">+7%</p>
        </div>

      </div>


      {/* Main Section */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Table */}

        <div className="lg:col-span-8 bg-white rounded-xl shadow p-4 md:p-6">

          <div className="flex justify-between mb-4">

            <h3 className="font-semibold text-lg">
              New booking
            </h3>

            <button className="text-sm text-purple-500">
              View All
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-sm min-w-[600px]">

              <thead className="text-gray-400 border-b">

                <tr>

                  <th className="text-left py-3">Booking ID</th>
                  <th className="text-left">Guest</th>
                  <th className="text-left">Room</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Check In</th>
                  <th className="text-left">Check Out</th>
                  <th>Status</th>

                </tr>

              </thead>

              <tbody className="divide-y">

                <tr className="hover:bg-gray-50">
                  <td className="py-3 font-medium">#1223</td>
                  <td>Alex Trie</td>
                  <td>S-01</td>
                  <td>Single</td>
                  <td>Jan 21</td>
                  <td>Jan 26</td>
                  <td>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                      New
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="py-3 font-medium">#1224</td>
                  <td>Annette Black</td>
                  <td>S-22</td>
                  <td>Single</td>
                  <td>Jan 8</td>
                  <td>Jan 20</td>
                  <td>
                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">
                      Checked In
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="py-3 font-medium">#1225</td>
                  <td>Jerome Bell</td>
                  <td>D-08</td>
                  <td>Double</td>
                  <td>Jan 13</td>
                  <td>Jan 21</td>
                  <td>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                      Confirmed
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>



        {/* Right Side */}

        <div className="lg:col-span-4 space-y-6">

          {/* Booking Overview */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center mb-6">

              <h3 className="font-semibold text-lg">
                Booking Overview
              </h3>

              <select className="text-sm border rounded-md px-2 py-1">
                <option>Monthly</option>
                <option>Weekly</option>
              </select>

            </div>

            <div className="flex items-end justify-between h-40">

              {[
                {month:"Jan",value:455,height:"h-28",color:"bg-black"},
                {month:"Feb",value:409,height:"h-24",color:"bg-pink-500"},
                {month:"Mar",value:222,height:"h-16",color:"bg-purple-300"}
              ].map((item,i)=>(
                <div key={i} className="flex flex-col items-center flex-1">

                  <p className="text-xs font-semibold mb-1">
                    {item.value}
                  </p>

                  <div className={`${item.color} w-6 md:w-8 ${item.height} rounded-lg`}></div>

                  <p className="text-xs mt-2 text-gray-500">
                    {item.month}
                  </p>

                </div>
              ))}

            </div>

          </div>



          {/* Category */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center mb-6">

              <h3 className="font-semibold text-lg">
                Top Category
              </h3>

              <select className="text-sm border rounded-md px-2 py-1">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>

            </div>

            <div className="flex flex-wrap justify-center items-center gap-6">

              <div className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-black text-white flex items-center justify-center rounded-full font-semibold">
                  56%
                </div>
                <p className="text-sm mt-2 text-gray-500">
                  Double room
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-purple-400 text-white flex items-center justify-center rounded-full">
                  30%
                </div>
                <p className="text-sm mt-2 text-gray-500">
                  Single room
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 flex items-center justify-center rounded-full">
                  14%
                </div>
                <p className="text-sm mt-2 text-gray-500">
                  Deluxe room
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;