import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Loader2 } from "lucide-react";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden flex-1 flex-col justify-between bg-card p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Camera className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            CamVault
          </span>
        </div>
        <div>
          <blockquote className="space-y-4">
            <p className="text-balance text-2xl font-medium leading-relaxed text-foreground">
              Keep track of every camera body and lens in your collection.
              Your personal gear vault.
            </p>
            <footer className="text-sm text-muted-foreground">
              Built for analog and digital photographers
            </footer>
          </blockquote>
        </div>
        <div className="text-xs text-muted-foreground">
          CamVault {new Date().getFullYear()}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
