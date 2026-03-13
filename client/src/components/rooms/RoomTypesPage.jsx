import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Layers } from "lucide-react";
import { getRoomTypes, createRoomType, updateRoomType, deleteRoomType } from "../../api/roomsApi";

const emptyForm = { name: "", bedType: "Double", pricePerNight: "", maxOccupancy: "", amenities: "", description: "" };
const BED_TYPES = ["Single", "Double", "Twin", "Triple", "King", "Queen"];

export default function RoomTypesPage() {
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const load = async () => {
        try { 
            setLoading(true); 
            const res = await getRoomTypes(); 
            setRoomTypes(res.data?.data?.roomTypes || res.data?.data || []); 
        }
        catch { setError("Failed to load room types."); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => { setForm(emptyForm); setFormError(""); setIsEditing(false); setEditId(null); setShowModal(true); };
    const openEdit = (rt) => { setForm({ ...rt, amenities: rt.amenities.join(", ") }); setFormError(""); setIsEditing(true); setEditId(rt._id); setShowModal(true); };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setFormError(""); 
        setSubmitting(true);
        const payload = { ...form, pricePerNight: Number(form.pricePerNight), maxOccupancy: Number(form.maxOccupancy), amenities: form.amenities.split(",").map(a => a.trim()).filter(Boolean) };
        try { isEditing ? await updateRoomType(editId, payload) : await createRoomType(payload); setShowModal(false); load(); }
        catch (err) { setFormError(err?.response?.data?.message || "An error occurred."); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        try { await deleteRoomType(deleteId); setDeleteId(null); load(); }
        catch { setError("Failed to delete room type."); }
    };

    return (
        <div className="p-4 md:p-10 space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Room Types</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Manage your room types and pricing</p>
                </div>
                <button onClick={openAdd} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl text-sm w-fit transition-all shadow-lg active:scale-95 flex items-center gap-2">
                    <Plus size={18} />
                    Add Room Type
                </button>
            </div>

            {error && <div className="mb-6 px-5 py-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold">{error}</div>}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                {loading ? (
                    <div className="col-span-full text-center py-24 text-gray-400 font-bold animate-pulse">Loading room types...</div>
                ) : roomTypes.length === 0 ? (
                    <div className="col-span-full text-center py-24 text-gray-400 font-bold bg-white rounded-2xl border-2 border-dashed border-gray-100 uppercase tracking-widest text-xs flex items-center justify-center">No room types found.</div>
                ) : roomTypes.map((rt) => (
                    <div key={rt._id} className="bg-white rounded-2xl shadow shadow-gray-100/50 hover:shadow-xl transition-all p-8 border border-gray-50 flex flex-col group transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-50 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <Layers size={20} />
                            </div>
                            <div className="text-right">
                                <p className="text-purple-600 font-bold text-xl leading-none">₹{rt.pricePerNight.toLocaleString()}</p>
                                <p className="text-[10px] font-medium text-gray-400 mt-1.5">per night</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{rt.name}</h3>
                        <p className="text-xs text-gray-400 font-medium mb-4">{rt.bedType} Bed • {rt.maxOccupancy} Persons</p>
                        
                        <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2 leading-relaxed">{rt.description || 'No description provided.'}</p>

                        <div className="mt-auto space-y-6">
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-50">
                                {rt.amenities.map((a, i) => (
                                    <span key={i} className="text-[10px] bg-gray-50 text-gray-400 px-3 py-1 rounded-lg border border-gray-100 font-bold uppercase">{a}</span>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <button onClick={() => openEdit(rt)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold py-3 rounded-xl transition-all">Edit</button>
                                <button onClick={() => setDeleteId(rt._id)} className="px-5 bg-red-50 text-red-500 py-3 rounded-xl transition-all hover:bg-red-500 hover:text-white">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50">
                            <h2 className="font-bold text-xl text-gray-900">{isEditing ? "Edit Room Type" : "Add Room Type"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none transition-colors">×</button>
                        </div>
                        {formError && <div className="mx-8 mt-6 px-5 py-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold">{formError}</div>}
                        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                    <input required placeholder="e.g. Presidential Suite" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bed Type</label>
                                    <select required value={form.bedType} onChange={e => setForm({ ...form, bedType: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-300 transition-all font-bold appearance-none">
                                        {BED_TYPES.map(bt => <option key={bt} value={bt}>{bt.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Per Night (₹)</label>
                                    <input type="number" required placeholder="5000" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Max Occupancy</label>
                                    <input type="number" required placeholder="2" value={form.maxOccupancy} onChange={e => setForm({ ...form, maxOccupancy: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities (comma separated)</label>
                                <input placeholder="High-speed WiFi, Mini Bar, City View" value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea rows={3} value={form.description} placeholder="Describe the room luxury..." onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium resize-none shadow-inner" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 rounded-xl text-sm font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 py-4 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all disabled:opacity-50">
                                    {submitting ? "Saving..." : isEditing ? "Save Changes" : "Save Room Type"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} />
                        </div>
                        <p className="font-bold text-gray-900 text-xl mb-2">Delete Room Type?</p>
                        <p className="text-gray-400 text-sm font-medium mb-8">This action is irreversible and will remove the room type from the database.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-4 rounded-xl text-sm font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-4 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all">Confirm Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
