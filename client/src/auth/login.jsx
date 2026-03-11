import { useState } from "react";
import { loginUser } from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser({
        email,
        password,
      });

      console.log(res);

      alert("Login Successful");
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 text-white items-center justify-center p-10">
        <div>
          <h1 className="text-4xl font-bold mb-4">Hotel Management System</h1>

          <p className="text-lg opacity-80">
            Manage bookings, staff, customers and operations efficiently.
          </p>
        </div>
      </div>

      {/* Right Side Login */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600">Email</label>

              <input
                type="email"
                required
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>

              <input
                type="password"
                required
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
