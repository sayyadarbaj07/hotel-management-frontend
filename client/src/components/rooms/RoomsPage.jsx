import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit } from "lucide-react";
import { getRooms, getRoomTypes, createRoom, updateRoom, updateRoomStatus, deleteRoom } from "../../api/roomsApi";

const STATUSES = ["available", "occupied", "maintenance", "reserved", "cleaning"];

const statusConfig = {
    available: { dot: "bg-green-500" },
    occupied: { dot: "bg-orange-500" },
    maintenance: { dot: "bg-red-500" },
    reserved: { dot: "bg-purple-500" },
    cleaning: { dot: "bg-blue-500" },
};

const emptyForm = { roomNumber: "", floor: "", roomType: "" };

export default function RoomsPage() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterFloor, setFilterFloor] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [statusModal, setStatusModal] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState("");

    const load = async () => {
        try {
            setLoading(true);
            const [rr, rt] = await Promise.all([getRooms(), getRoomTypes()]);
            setRooms(rr.data?.data?.rooms || rr.data?.data || []);
            setRoomTypes(rt.data?.data?.roomTypes || rt.data?.data || []);
        } catch { setError("Failed to load inventory data."); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const filtered = rooms.filter(r => {
        if (filterType && r.roomType._id !== filterType) return false;
        if (filterStatus && r.status !== filterStatus) return false;
        if (filterFloor && String(r.floor) !== filterFloor) return false;
        if (search && !r.roomNumber.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const openAdd = () => { setForm({ ...emptyForm, roomType: roomTypes.length > 0 ? roomTypes[0]._id : "" }); setFormError(""); setIsEditing(false); setEditId(null); setShowModal(true); };
    const openEdit = (r) => { setForm({ roomNumber: r.roomNumber, floor: r.floor, roomType: r.roomType._id }); setFormError(""); setIsEditing(true); setEditId(r._id); setShowModal(true); };
    const openStatus = (r) => { setStatusModal(r); setNewStatus(r.status); };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setFormError(""); 
        
        if (!form.roomType) {
            setFormError("A Room Type selection is mandatory.");
            return;
        }

        setSubmitting(true);
        const payload = { ...form, floor: Number(form.floor) };
        try { isEditing ? await updateRoom(editId, payload) : await createRoom(payload); setShowModal(false); load(); }
        catch (err) { setFormError(err?.response?.data?.message || "Operation failed."); }
        finally { setSubmitting(false); }
    };

    const handleStatusUpdate = async () => {
        try { await updateRoomStatus(statusModal._id, newStatus); setStatusModal(null); load(); }
        catch { setError("Failed to sync room status."); }
    };

    const handleDelete = async () => {
        try { await deleteRoom(deleteId); setDeleteId(null); load(); }
        catch { setError("Failed to remove room asset."); }
    };

    // Total counts for stats
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === "occupied").length;
    const availableRooms = rooms.filter(r => r.status === "available").length;

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            {/* Top Header */}
            <div className="bg-gradient-to-r from-[#0c1028] to-[#1a2048] rounded-xl p-6 text-white mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-semibold">Rooms</h1>
                    <button onClick={openAdd} className="bg-purple-500 px-4 py-2 rounded-lg text-sm w-fit transition-all active:scale-95">
                        + Add new room
                    </button>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 text-sm">
                    <button 
                        onClick={() => setFilterStatus("")}
                        className={`${!filterStatus ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"} px-4 py-1 rounded-lg transition-colors`}
                    >
                        All
                    </button>
                    {STATUSES.map(s => {
                        const snippetLabel = s === "available" ? "Available" : 
                                             s === "occupied" ? "Occupied" : 
                                             s === "cleaning" ? "To clean" : 
                                             s === "maintenance" ? "Repair" : s === "reserved" ? "Reserved" : s;
                        return (
                            <button 
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={`${filterStatus === s ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"} px-4 py-1 rounded-lg transition-colors`}
                            >
                                {snippetLabel}
                            </button>
                        );
                    })}
                </div>
            </div>

            {error && <div className="mb-6 px-5 py-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold">{error}</div>}

            {/* Search Bar */}
            <div className="mb-8 relative max-w-md">
                <input
                    type="text"
                    placeholder="Search room number..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
                />
                <span className="absolute left-3.5 top-3 text-gray-400">🔍</span>
            </div>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-24 text-gray-400 font-bold animate-pulse">Loading rooms...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center py-24 text-gray-400 font-bold border rounded-xl flex items-center justify-center bg-white shadow-sm uppercase tracking-widest text-xs">No matching rooms found.</div>
                ) : filtered.map((room) => (
                    <div
                        key={room._id}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
                    >
                        {/* Image */}
                        <img
                            src={room.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"}
                            alt={room.roomNumber}
                            className="w-full h-40 object-cover rounded-lg cursor-pointer"
                            onClick={() => navigate(`/admin/rooms/${room._id}`)}
                        />

                        {/* Room Title */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900 line-clamp-1">
                                    {room.roomType.name}
                                </h3>
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                                    room.status === "available" ? "bg-green-100 text-green-600" :
                                    room.status === "occupied" ? "bg-orange-100 text-orange-600" :
                                    room.status === "maintenance" ? "bg-red-100 text-red-600" :
                                    "bg-blue-100 text-blue-600"
                                }`}>
                                    {room.status === "maintenance" ? "Repair" : room.status === "cleaning" ? "To clean" : room.status}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1">
                                Type: {room.roomType.name}
                            </p>
                        </div>

                        {/* Room Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-4 text-sm font-medium">
                            <div className="bg-gray-50 rounded-lg p-2 flex flex-col justify-center border border-gray-100/50">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                    Room number
                                </p>
                                <p className="font-bold text-gray-900 truncate">
                                    {room.roomNumber}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 flex flex-col justify-center border border-gray-100/50">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                    Room rate
                                </p>
                                <p className="font-bold text-gray-900 truncate">
                                    ₹{room.roomType.pricePerNight.toLocaleString()}/night
                                </p>
                            </div>
                        </div>

                        {/* Maintenance section */}
                        <div className="bg-gray-50 rounded-lg p-2 mt-3 text-sm flex flex-col justify-center border border-gray-100/50">
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                Last maintenance
                            </p>
                            <p className="font-bold text-gray-900">
                                {new Date(room.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4 pt-2">
                            <button 
                                onClick={() => navigate(`/admin/rooms/${room._id}`)}
                                className="flex-1 border border-gray-200 rounded-lg py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 whitespace-nowrap"
                            >
                                Room details ↗
                            </button>
                            <button 
                                onClick={() => openEdit(room)}
                                className="px-3 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Update
                            </button>
                            <button 
                                onClick={() => setDeleteId(room._id)}
                                className="px-3 border border-red-100 rounded-lg text-[11px] font-bold text-red-500 hover:bg-red-50 transition-all active:scale-95"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals remain for functionality */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50">
                            <h2 className="font-bold text-xl text-gray-900">{isEditing ? "Edit Room" : "Add Room"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none transition-colors">×</button>
                        </div>
                        {formError && <div className="mx-8 mt-6 px-5 py-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold">{formError}</div>}
                        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                                <input type="text" required value={form.roomNumber} placeholder="101"
                                    onChange={e => setForm({ ...form, roomNumber: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Floor</label>
                                <input type="number" required min="1" value={form.floor} placeholder="1"
                                    onChange={e => setForm({ ...form, floor: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                                <select required value={form.roomType} onChange={e => setForm({ ...form, roomType: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-300 transition-all font-bold appearance-none">
                                    <option value="">Select Type</option>
                                    {roomTypes.map(rt => <option key={rt._id} value={rt._id}>{rt.name}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg text-sm font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-lg text-sm font-bold bg-[#0c1028] hover:bg-indigo-900 text-white shadow-lg transition-all disabled:opacity-50">
                                    {submitting ? "Saving..." : isEditing ? "Save Changes" : "Save Room"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} />
                        </div>
                        <p className="font-bold text-gray-900 text-xl mb-2">Delete Room?</p>
                        <p className="text-gray-400 text-sm font-medium mb-8">This action is irreversible.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-lg text-xs font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-3 rounded-lg text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
