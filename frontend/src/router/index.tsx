import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
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
import ProtectedRoute from "@/components/ProtectedRoute";

// export default function AppRouter() {
//   return (
//     <Routes>
//       {/* Public auth routes */}
//       <Route element={<AuthLayout />}>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//       </Route>

//       {/* App routes (auth bypassed for dev) */}
//       <Route element={<MainLayout />}>
//         <Route path="/dashboard" element={<DashboardPage />} />

//         <Route path="/cameras" element={<CamerasPage />} />
//         <Route path="/cameras/:id" element={<CameraDetailPage />} />
//         <Route path="/cameras/new" element={<AddCameraPage />} />

//         <Route path="/lenses" element={<LensesPage />} />
//         <Route path="/lenses/:id" element={<LensDetailPage />} />
//         <Route path="/lenses/new" element={<AddLensPage />} />
//       </Route>

//       {/* Default redirect */}
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// }

const routes: RouteObject[] = [
  {
    // Public Auth Routes (Redirects to Dashboard if already logged in)
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  {
    // PROTECTED APP ROUTES
    // 1. First, check if the user is authenticated
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          {
            path: "cameras",
            children: [
              { index: true, element: <CamerasPage /> },
              { path: ":id", element: <CameraDetailPage /> },
              { path: "new", element: <AddCameraPage /> },
            ],
          },
          {
            path: "lenses",
            children: [
              { index: true, element: <LensesPage /> },
              { path: ":id", element: <LensDetailPage /> },
              { path: "new", element: <AddLensPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
];

export const router = createBrowserRouter(routes);
