import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, User as UserIcon, Edit, Trash2, Plus, Key } from "lucide-react";
import { getUsers, registerUser, updateUser, deleteUser } from "./api";

const ROLES = ["admin", "receptionist", "housekeeping"];
const emptyForm = { name: "", email: "", password: "", phone: "", role: "receptionist" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [passModalUser, setPassModalUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data.users);
    } catch { setError("Failed to fetch users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setFormError(""); setIsEditing(false); setEditId(null); setShowModal(true); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, password: "", phone: u.phone, role: u.role }); setFormError(""); setIsEditing(true); setEditId(u._id); setShowModal(true); };
  const openPassModal = (u) => { setPassModalUser(u); setNewPassword(""); setFormError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setFormError(""); 
    setSubmitting(true);
    try {
      if (isEditing) { const { password, ...rest } = form; await updateUser(editId, rest); }
      else await registerUser(form);
      setShowModal(false); fetchUsers();
    } catch (err) { setFormError(err?.response?.data?.message || "An error occurred."); }
    finally { setSubmitting(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      // NOTE: This uses the existing updateUser endpoint.
      // If the backend blocks password updates here, this will only update other fields.
      await updateUser(passModalUser._id, { password: newPassword });
      setPassModalUser(null);
      fetchUsers();
    } catch (err) { 
        setFormError(err?.response?.data?.message || "Failed to reset password."); 
    } finally { 
        setSubmitting(false); 
    }
  };

  const handleDelete = async () => {
    try { await deleteUser(deleteId); setDeleteId(null); fetchUsers(); }
    catch { setError("Failed to delete user."); }
  };

  return (
    <div className="p-4 md:p-10 space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Manage your hotel staff and permissions</p>
        </div>
        <button onClick={openAdd} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl text-sm w-fit transition-all shadow-lg active:scale-95 flex items-center gap-2">
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email or role..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl pl-12 pr-6 py-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-200 transition-all font-medium"
          />
        </div>
        <div className="flex flex-wrap gap-2 h-fit">
          <button 
            onClick={() => setSearch("")}
            className={`${!search ? "bg-gray-900 text-white shadow-xl scale-105" : "bg-white text-gray-400 hover:text-gray-900"} px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-gray-200`}
          >
            All
          </button>
          {ROLES.map(role => (
            <button 
              key={role}
              onClick={() => setSearch(role)}
              className={`${search.toLowerCase() === role ? "bg-gray-900 text-white shadow-xl scale-105" : "bg-white text-gray-400 hover:text-gray-900"} px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all border border-transparent hover:border-gray-200`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 px-5 py-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold shadow-sm">{error}</div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
        {loading ? (
          <div className="col-span-full text-center py-24 text-gray-400 font-bold animate-pulse">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-24 text-gray-400 font-bold bg-white rounded-2xl border-2 border-dashed border-gray-100">No matching users found.</div>
        ) : filtered.map((u) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            key={u._id} 
            className="bg-white rounded-2xl shadow shadow-gray-100/50 hover:shadow-xl transition-all p-6 border border-gray-50 group flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <button onClick={() => openEdit(u)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900" title="Edit Staff">
                    <Edit size={16} />
                </button>
                <button onClick={() => openPassModal(u)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-purple-600" title="Change Password">
                    <Key size={16} />
                </button>
            </div>

            {/* Avatar */}
            <div className="w-20 h-20 bg-gray-50 rounded-full mb-6 flex items-center justify-center border border-gray-50 shadow-inner group-hover:scale-110 transition-transform">
              <UserIcon size={32} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{u.name}</h3>
            <p className="text-xs text-gray-400 font-medium lowercase mb-4 truncate w-full px-2">{u.email}</p>

            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
              u.role === 'admin' ? 'bg-gray-900 text-white shadow-lg' : 
              u.role === 'receptionist' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
            }`}>
              {u.role}
            </span>

            <div className="w-full mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
               <div className="text-left">
                  <p className="text-[9px] font-bold uppercase text-gray-300">Phone</p>
                  <p className="text-xs font-bold text-gray-900">{u.phone || 'N/A'}</p>
               </div>
               <button 
                 onClick={() => setDeleteId(u._id)} 
                 className="p-3 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-md auto overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50">
              <h2 className="font-bold text-xl text-gray-900">{isEditing ? "Edit Staff" : "Add Staff"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none transition-colors">×</button>
            </div>

            {formError && (
              <div className="mx-8 mt-6 px-5 py-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
              {[["Name", "name", "text", "John Doe"], ["Email", "email", "email", "john@hotel.com"], ["Phone", "phone", "text", "+1 234 567 890"]].map(([lbl, key, type, ph]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{lbl}</label>
                  <input type={type} required value={form[key]} placeholder={ph}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium"
                  />
                </div>
              ))}

              {!isEditing && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input type="password" required value={form.password} placeholder="••••••••"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-purple-300 transition-all font-bold appearance-none">
                  {ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-xl text-sm font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-4 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all disabled:opacity-50">
                  {submitting ? "Saving..." : isEditing ? "Save Changes" : "Save Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passModalUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
           <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50">
                <h2 className="font-bold text-xl text-gray-900">Change Password</h2>
                <button onClick={() => setPassModalUser(null)} className="text-gray-400 hover:text-gray-900 text-2xl leading-none transition-colors">×</button>
              </div>

              {formError && (
                <div className="mx-8 mt-6 px-5 py-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-xl font-bold">{formError}</div>
              )}

              <form onSubmit={handleResetPassword} className="px-8 py-8 space-y-6">
                <div>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">User</p>
                   <p className="text-lg font-bold text-gray-900 mb-6">{passModalUser.name}</p>

                   <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                   <input 
                     type="password" 
                     required 
                     placeholder="••••••••"
                     value={newPassword}
                     onChange={e => setNewPassword(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:border-purple-300 transition-all font-medium"
                   />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setPassModalUser(null)}
                    className="flex-1 py-4 rounded-xl text-sm font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="flex-1 py-4 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all disabled:opacity-50">
                    {submitting ? "Updating..." : "Update Password"}
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
            <p className="font-bold text-gray-900 text-xl mb-2">Delete User?</p>
            <p className="text-gray-400 text-sm font-medium mb-8">This action is irreversible and will remove the user from the database.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-4 rounded-xl text-sm font-bold text-gray-400 border border-gray-100 hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={handleDelete}
                className="flex-1 py-4 rounded-xl text-sm font-bold bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
