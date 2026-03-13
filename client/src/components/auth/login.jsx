import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      const allowedRoles = ["admin", "receptionist", "housekeeping"];
      if (allowedRoles.includes(user.role)) {
        navigate("/admin");
      } else {
        setError("Access denied. Unauthorized role.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gray-900 p-16 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white rounded-full blur-[100px]"></div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <span className="text-3xl">🏨</span>
          <span className="text-white font-extrabold text-2xl tracking-tight">HotelPro</span>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Modernize Your<br />Hotel Management
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-md">
            Streamline bookings, empower your staff, and deliver exceptional guest experiences—all from one powerful dashboard.
          </p>
        </div>

        <p className="text-gray-500 text-sm relative z-10">© 2024 HotelPro. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-white shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.1)] relative z-10">
        <div className="w-full max-w-[400px]">

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-3">Sign in to your admin dashboard</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@hotel.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-gray-50 focus:bg-white transition-colors tracking-widest placeholder:tracking-normal"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4">
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
