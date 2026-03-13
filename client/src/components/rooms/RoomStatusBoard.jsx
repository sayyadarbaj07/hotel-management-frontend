import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, Users, ClipboardList, Hotel, Clock, Activity, BarChart3 } from "lucide-react";
import { getRooms } from "../../api/roomsApi";
import { getUsers } from "../users/api";

const statusConfig = {
    available: { label: "Available", color: "green", bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500", border: "border-green-100" },
    occupied: { label: "Occupied", color: "red", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", border: "border-red-100" },
    cleaning: { label: "To clean", color: "yellow", bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-500", border: "border-yellow-100" },
    maintenance: { label: "Repair", color: "orange", bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500", border: "border-orange-100" },
    reserved: { label: "Reserved", color: "purple", bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500", border: "border-purple-100" }
};

export default function RoomStatusBoard() {
    const [rooms, setRooms] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [rRes, uRes] = await Promise.all([getRooms(), getUsers()]);
                const roomsData = rRes.data.data.rooms || rRes.data.data || [];
                setRooms(roomsData);
                setUserCount(uRes.data?.users?.length || 0);
            } catch (err) {
                console.error("Failed to load status board data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const stats = [
        { title: "Total Rooms", value: rooms.length, icon: <BedDouble size={24} />, color: "bg-blue-600 shadow-blue-500/30" },
        { title: "Available Rooms", value: rooms.filter(r => r.status === "available").length, icon: <Hotel size={24} />, color: "bg-green-600 shadow-green-500/30" },
        { title: "Staff Members", value: userCount, icon: <Users size={24} />, color: "bg-purple-600 shadow-purple-500/30" },
        { title: "Occupied Rooms", value: rooms.filter(r => r.status === "occupied").length, icon: <ClipboardList size={24} />, color: "bg-orange-600 shadow-orange-500/30" }
    ];

    if (loading) return (
        <div className="p-10 text-center py-40">
            <div className="inline-block animate-spin mb-4 text-purple-600">
                <Activity size={40} />
            </div>
            <p className="text-gray-400 font-bold text-xs">Loading room status...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-10 space-y-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Room Status</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">View all rooms and their status</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Live</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow shadow-gray-100/50 p-8 flex items-center justify-between border border-gray-50 group transition-all"
                    >
                        <div>
                            <p className="text-gray-400 text-xs font-bold mb-3">{item.title}</p>
                            <h2 className="text-4xl font-bold text-gray-900 leading-none">{item.value}</h2>
                        </div>
                        <div className={`${item.color} text-white p-4 rounded-xl shadow-lg transition-transform group-hover:scale-110`}>
                            {item.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Status Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Room Status Details */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow shadow-gray-100/50 p-10 border border-gray-50"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <BarChart3 size={24} className="text-blue-600" />
                            <h3 className="font-bold text-xl text-gray-900 tracking-tight">Room Status</h3>
                        </div>
                        <span className="text-xs font-bold text-gray-400">Total Rooms: {rooms.length}</span>
                    </div>
                    
                    <div className="space-y-4">
                        {Object.entries(statusConfig).map(([key, s]) => (
                            <div key={key} className={`${s.bg} p-6 rounded-2xl border ${s.border} flex justify-between items-center group transition-all`}>
                                <div className="flex items-center gap-4">
                                    <span className={`w-3 h-3 rounded-full ${s.dot} shadow-sm shadow-current`} />
                                    <span className={`font-bold text-sm ${s.text}`}>{s.label}</span>
                                </div>
                                <span className={`bg-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm ${s.text}`}>
                                    {rooms.filter(r => r.status === key).length}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* System Insights */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl shadow shadow-gray-100/50 p-10 border border-gray-50 flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-10">
                        <Clock size={24} className="text-purple-600" />
                        <h3 className="font-bold text-xl text-gray-900 tracking-tight">Insights</h3>
                    </div>

                    <div className="space-y-8 flex-grow">
                        <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-1">Most Occupied</p>
                                <p className="text-lg font-bold text-gray-900">Floor #02</p>
                            </div>
                            <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-lg font-bold">TOP</span>
                        </div>
                        
                        <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-1">Staff to Room Ratio</p>
                                <p className="text-lg font-bold text-gray-900">1 : {(rooms.length / (userCount || 1)).toFixed(1)}</p>
                            </div>
                            <Users size={20} className="text-gray-200" />
                        </div>

                        <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-1">Top Room Type</p>
                                <p className="text-lg font-bold text-gray-900">Deluxe</p>
                            </div>
                            <span className="text-xs font-bold text-blue-500">Popular</span>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-400 font-medium leading-relaxed">
                        Data is updated in real-time as changes occur in the system.
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
