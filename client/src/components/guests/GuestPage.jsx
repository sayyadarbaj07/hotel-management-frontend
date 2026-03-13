import { useEffect, useState } from "react";
import { Search, Plus, Trash2, Edit, UserPlus, Globe, Phone, Mail } from "lucide-react";
import { getGuests, createGuest, updateGuest, deleteGuest, searchGuests } from "../../api/guestApi";

const ID_TYPES = [
    { value: "passport", label: "Passport" },
    { value: "aadhaar", label: "Aadhaar Card" },
    { value: "driving_license", label: "Driving License" },
    { value: "voter_id", label: "Voter ID" },
];

const emptyForm = {
    firstName: "", lastName: "", email: "", phone: "",
    idType: "aadhaar", idNumber: "", nationality: "Indian",
    dateOfBirth: "", notes: "",
    address: { street: "", city: "", state: "", country: "India", pincode: "" }
};

export default function GuestPage() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const load = async (query = "") => {
        try {
            setLoading(true);
            const res = query ? await searchGuests(query) : await getGuests();
            const rawData = res.data?.data;
            const guestList = rawData?.guests || rawData?.search || rawData || [];
            setGuests(Array.isArray(guestList) ? guestList : []);
            setError("");
        } catch { setError("Failed to load guests."); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => { load(searchTerm); }, 300);
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const openAdd = () => { setForm(emptyForm); setFormError(""); setIsEditing(false); setEditId(null); setShowModal(true); };
    const openEdit = (g) => { 
        setForm({
            firstName: g.firstName || "",
            lastName: g.lastName || "",
            email: g.email || "",
            phone: g.phone || "",
            idType: g.idType || "aadhaar",
            idNumber: g.idNumber || "",
            nationality: g.nationality || "Indian",
            dateOfBirth: g.dateOfBirth ? g.dateOfBirth.split("T")[0] : "",
            notes: g.notes || "",
            address: {
                street: g.address?.street || "",
                city: g.address?.city || "",
                state: g.address?.state || "",
                country: g.address?.country || "India",
                pincode: g.address?.pincode || ""
            }
        }); 
        setFormError(""); setIsEditing(true); setEditId(g._id); setShowModal(true); 
    };

    const handleFormChange = (field, value) => { setForm(prev => ({ ...prev, [field]: value })); };
    const handleAddressChange = (field, value) => { setForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } })); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setFormError(""); setSubmitting(true);
        const payload = { ...form };
        if (!payload.dateOfBirth) delete payload.dateOfBirth;
        try { isEditing ? await updateGuest(editId, payload) : await createGuest(payload); setShowModal(false); load(searchTerm); }
        catch (err) { setFormError(err?.response?.data?.message || "An error occurred."); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        try { await deleteGuest(deleteId); setDeleteId(null); load(searchTerm); }
        catch { setError("Failed to delete guest."); }
    };

    return (
        <div className="p-4 md:p-10 space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Guests</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Manage your guest records</p>
                </div>
                <button onClick={openAdd} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl text-sm w-fit transition-all shadow-lg active:scale-95 flex items-center gap-2">
                    <UserPlus size={18} />
                    Add Guest
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 max-w-xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by guest name or email..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-6 py-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-200 transition-all font-medium"
                    />
                </div>
            </div>

            {error && <div className="mb-6 px-5 py-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold">{error}</div>}

            {/* Guest List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                {loading ? (
                    <div className="col-span-full text-center py-24 text-gray-400 font-bold animate-pulse">Loading guests...</div>
                ) : guests.length === 0 ? (
                    <div className="col-span-full text-center py-24 text-gray-400 font-bold bg-white rounded-2xl border-2 border-dashed border-gray-100 uppercase tracking-widest text-xs flex items-center justify-center">No guests found.</div>
                ) : guests.map((g) => (
                    <div key={g._id} className="bg-white rounded-2xl shadow shadow-gray-100/50 hover:shadow-xl transition-all p-8 border border-gray-50 flex flex-col group transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-50 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                <span className="text-xl font-bold">{g.firstName.charAt(0)}{g.lastName.charAt(0)}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-purple-600 font-bold text-xs uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-lg">{g.nationality}</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors truncate">{g.firstName} {g.lastName}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 leading-none">Total Stays: {g.totalStays || 0}</p>

                        <div className="space-y-4 flex-grow">
                            <div className="flex items-center gap-3 text-gray-500">
                                <Phone size={14} className="text-gray-300" />
                                <span className="text-xs font-bold">{g.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <Mail size={14} className="text-gray-300" />
                                <span className="text-xs font-bold truncate">{g.email || 'N/A'}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <p className="text-[9px] font-bold uppercase text-gray-300 tracking-tighter mb-1">ID Verified</p>
                                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">{g.idType.replace('_', ' ')} • {g.idNumber}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-3">
                            <button onClick={() => openEdit(g)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold py-3 rounded-xl transition-all">Edit</button>
                            <button onClick={() => setDeleteId(g._id)} className="px-5 bg-red-50 text-red-500 py-3 rounded-xl transition-all hover:bg-red-500 hover:text-white">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center px-10 py-7 border-b border-gray-50">
                            <h2 className="font-bold text-2xl text-gray-900 tracking-tight">{isEditing ? "Edit Guest" : "Add Guest"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 text-3xl leading-none transition-colors">×</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                            {formError && <div className="mb-8 px-6 py-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold">{formError}</div>}
                            
                            <form id="guestForm" onSubmit={handleSubmit} className="space-y-10">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                        Guest Details
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="First Name" value={form.firstName} onChange={v => handleFormChange("firstName", v)} required />
                                        <Input label="Last Name" value={form.lastName} onChange={v => handleFormChange("lastName", v)} required />
                                        <Input label="Phone" value={form.phone} onChange={v => handleFormChange("phone", v)} required />
                                        <Input label="Email" type="email" value={form.email} onChange={v => handleFormChange("email", v)} />
                                        <Input label="Birth Date" type="date" value={form.dateOfBirth} onChange={v => handleFormChange("dateOfBirth", v)} />
                                        <Input label="Nationality" value={form.nationality} onChange={v => handleFormChange("nationality", v)} required />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                        Identification
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">ID Type</label>
                                            <select required value={form.idType} onChange={e => handleFormChange("idType", e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-300 transition-all font-bold appearance-none">
                                                {ID_TYPES.map(t => <option key={t.value} value={t.value}>{t.label.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                        <Input label="ID Number" value={form.idNumber} onChange={v => handleFormChange("idNumber", v)} required uppercase />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                        Address
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </h3>
                                    <div className="space-y-6">
                                        <Input label="Street" value={form.address.street} onChange={v => handleAddressChange("street", v)} />
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <Input label="City" value={form.address.city} onChange={v => handleAddressChange("city", v)} />
                                            <Input label="State" value={form.address.state} onChange={v => handleAddressChange("state", v)} />
                                            <Input label="Country" value={form.address.country} onChange={v => handleAddressChange("country", v)} />
                                            <Input label="Pincode" value={form.address.pincode} onChange={v => handleAddressChange("pincode", v)} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                        Notes
                                        <div className="h-px bg-gray-100 flex-1"></div>
                                    </h3>
                                    <textarea rows={3} value={form.notes} placeholder="Write any notes about the guest..." onChange={e => handleFormChange("notes", e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-6 py-5 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium resize-none shadow-inner" />
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-10 py-7 border-t border-gray-50 flex gap-4 justify-end">
                            <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 rounded-xl text-sm font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
                            <button type="submit" form="guestForm" disabled={submitting} className="px-10 py-4 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all disabled:opacity-50">
                                {submitting ? "Saving..." : isEditing ? "Save Changes" : "Save Guest"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-100">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="font-bold text-gray-900 text-xl mb-2">Delete Guest?</h3>
                        <p className="text-sm text-gray-400 font-medium mb-8 leading-relaxed">This action is irreversible and will remove the guest from the database.</p>
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

function Input({ label, value, onChange, type = "text", required, uppercase }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <input type={type} required={required} value={value} 
                onChange={e => onChange(e.target.value)}
                className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium ${uppercase ? 'uppercase' : ''}`} />
        </div>
    );
}
