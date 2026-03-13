import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, BedDouble, Info, CheckCircle, Save, Settings, ShieldCheck, Zap } from "lucide-react";
import { getRoomById, updateRoomStatus } from "../../api/roomsApi";

const STATUSES = ["available", "occupied", "maintenance", "reserved", "cleaning"];

const statusConfig = {
    available: { label: "Available", bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500", border: "border-green-100" },
    occupied: { label: "Occupied", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500", border: "border-red-100" },
    cleaning: { label: "To Clean", bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-500", border: "border-yellow-100" },
    maintenance: { label: "Repair", bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500", border: "border-orange-100" },
    reserved: { label: "Reserved", bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500", border: "border-purple-100" }
};

export default function RoomDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getRoomById(id)
            .then(res => {
                const roomData = res.data.data.room || res.data.data;
                setRoom(roomData);
                setStatus(roomData.status);
            })
            .catch(() => setError("Room not found."))
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusSave = async () => {
        setSaving(true);
        try {
            await updateRoomStatus(id, status);
            setSaved(true);
            setRoom(prev => ({ ...prev, status }));
            setTimeout(() => setSaved(false), 2000);
        } catch { setError("Failed to update status."); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="p-10 text-center py-40">
            <div className="inline-block animate-spin mb-4 text-purple-600">
                <Zap size={40} />
            </div>
            <p className="text-gray-400 font-bold text-xs">Loading room details...</p>
        </div>
    );

    if (error) return (
        <div className="p-10">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl">
                <p className="text-red-700 font-bold text-sm">{error}</p>
                <button onClick={() => navigate("/rooms")} className="mt-4 text-sm font-bold text-red-500 hover:underline">Return to Rooms</button>
            </div>
        </div>
    );

    const sc = statusConfig[room.status];

    return (
        <div className="p-4 md:p-10 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
                <button onClick={() => navigate("/rooms")}
                    className="group bg-white border border-gray-100 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-xs">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Rooms
                </button>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-purple-600" />
                    <p className="text-xs font-bold text-gray-400">Verified</p>
                </div>
            </div>

            {/* Hero Card */}
            <div className="bg-white rounded-2xl shadow shadow-gray-100/50 overflow-hidden border border-gray-50 max-w-5xl mx-auto">
                <div className="bg-gradient-to-br from-[#0c1028] to-[#1a2048] p-12 text-white relative h-80 flex flex-col justify-end">
                    <div className="absolute top-10 right-10">
                        <div className={`backdrop-blur-xl bg-white/10 px-6 py-3 rounded-xl border border-white/20 flex items-center gap-4`}>
                            <span className={`w-3 h-3 rounded-full ${sc.dot}`} />
                            <span className="font-bold uppercase text-xs tracking-widest">{sc.label}</span>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-purple-400">
                            <BedDouble size={32} />
                            <span className="text-xs font-bold uppercase tracking-widest">Room Status</span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight mb-4">Room {room.roomNumber}</h1>
                        <p className="text-lg font-medium text-white/60">{room.roomType.name} • FLOOR {room.floor}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-50">
                    {/* Status Update Section */}
                    <div className="p-12 space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                <Settings size={24} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 tracking-tight">Update Room Status</h3>
                        </div>

                        <div className="space-y-8">
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                Update the status of this room manually.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch gap-4">
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-6 py-4 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-300 transition-all font-bold"
                                >
                                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                                <button
                                    onClick={handleStatusSave}
                                    disabled={saving || status === room.status}
                                    className="px-10 py-4 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-500 disabled:opacity-40 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                                >
                                    {saving ? "Saving..." : saved ? <CheckCircle size={18} /> : <Save size={18} />}
                                    {saving ? "Saving..." : saved ? "Saved" : "Update Status"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Room Info Section */}
                    <div className="p-12 space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                                <Info size={24} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 tracking-tight">Room Info</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Price</p>
                                    <p className="text-2xl font-bold text-gray-900">₹{room.roomType.pricePerNight.toLocaleString()}</p>
                                </div>
                                <span className="text-[10px] font-bold text-purple-500 uppercase bg-purple-50 px-2 py-1 rounded">Night</span>
                            </div>

                            <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1">Capacity</p>
                                    <p className="text-xl font-bold text-gray-900">{room.roomType.maxOccupancy} Guests</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <p className="text-xs font-bold text-gray-400 mb-4">Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {room.roomType.amenities.map(a => (
                                        <span key={a} className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg border border-gray-100">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reservations Section Placeholder */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-16 text-center max-w-5xl mx-auto">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl grayscale">📅</div>
                <h4 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">Bookings</h4>
                <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                    Past and future bookings for this room will appear here.
                </p>
            </div>
        </div>
    );
}
