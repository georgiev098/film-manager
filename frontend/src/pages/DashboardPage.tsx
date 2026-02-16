import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCameras } from "@/hooks/useCameras";
import { useLenses } from "@/hooks/useLenses";
import {
  Camera,
  CircleDot,
  ArrowRight,
  Plus,
  Loader2,
} from "lucide-react";
import CameraCard from "@/components/CameraCard";
import LensCard from "@/components/LensCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: cameras, isLoading: camerasLoading } = useCameras();
  const { data: lenses, isLoading: lensesLoading } = useLenses();

  const isLoading = camerasLoading || lensesLoading;
  const cameraCount = cameras?.length ?? 0;
  const lensCount = lenses?.length ?? 0;

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">
            Welcome back, {user?.username}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here is an overview of your gear collection.
          </p>
        </div>
        <Link
          to="/cameras/new"
          className="flex w-fit items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Gear
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {isLoading ? "-" : cameraCount}
            </p>
            <p className="text-sm text-muted-foreground">Camera Bodies</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <CircleDot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {isLoading ? "-" : lensCount}
            </p>
            <p className="text-sm text-muted-foreground">Lenses</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
            <span className="text-lg font-semibold text-foreground">
              {isLoading ? "-" : cameraCount + lensCount}
            </span>
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">Total</p>
            <p className="text-sm text-muted-foreground">
              Pieces in your vault
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Recent Cameras */}
      {!isLoading && cameras && cameras.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Cameras
            </h2>
            <Link
              to="/cameras"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cameras.slice(0, 3).map((camera) => (
              <CameraCard key={camera.ID} camera={camera} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Lenses */}
      {!isLoading && lenses && lenses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Lenses
            </h2>
            <Link
              to="/lenses"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lenses.slice(0, 3).map((lens) => (
              <LensCard key={lens.ID} lens={lens} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state for fresh users */}
      {!isLoading && cameraCount === 0 && lensCount === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
          <Camera className="h-14 w-14 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            Your vault is empty
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start by adding your first camera or lens.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/cameras/new"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Camera
            </Link>
            <Link
              to="/lenses/new"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <Plus className="h-4 w-4" />
              Add Lens
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
