import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/login";
import AdminDashboard from "../dashboard/adminDashboard";
import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "./protectedRoute";
import Users from "../users/User";
import RoomTypesPage from "../rooms/RoomTypesPage";
import RoomsPage from "../rooms/RoomsPage";
import RoomDetailPage from "../rooms/RoomDetailPage";
import RoomStatusBoard from "../rooms/RoomStatusBoard";
import GuestPage from "../guests/GuestPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin routes with Layout */}
      <Route path="/admin" element={<ProtectedRoute role={["admin", "receptionist", "housekeeping"]}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
        <Route path="room-types" element={<ProtectedRoute role="admin"><RoomTypesPage /></ProtectedRoute>} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="rooms/:id" element={<RoomDetailPage />} />
        <Route path="rooms/status-board" element={<RoomStatusBoard />} />
        <Route path="guests" element={<ProtectedRoute role={["admin", "receptionist"]}><GuestPage /></ProtectedRoute>} />
      </Route>

      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
