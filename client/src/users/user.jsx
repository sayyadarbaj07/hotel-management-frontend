import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "./api";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            User Management
          </h1>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
            Add User
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
