import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import CamerasPage from "@/pages/CamerasPage";
import LensesPage from "@/pages/LensesPage";
import AddCameraPage from "@/pages/AddCameraPage";
import CameraDetailPage from "@/pages/CameraDetailPage";
import AddLensPage from "@/pages/AddLensPage";
import LensDetailPage from "@/pages/LensDetailPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* App routes (auth bypassed for dev) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cameras" element={<CamerasPage />} />
        <Route path="/cameras/new" element={<AddCameraPage />} />
        <Route path="/lenses" element={<LensesPage />} />
        <Route path="/lenses/new" element={<AddLensPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
