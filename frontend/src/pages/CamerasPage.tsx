import { Link } from "react-router-dom";
import { useCameras, useDeleteCamera } from "@/hooks/useCameras";
import CameraCard from "@/components/CameraCard";
import EmptyState from "@/components/EmptyState";
import { Camera, Loader2, Plus } from "lucide-react";

export default function CamerasPage() {
  const { data: cameras, isLoading } = useCameras();
  const deleteMutation = useDeleteCamera();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this camera?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Cameras
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cameras ? `${cameras.length} camera${cameras.length !== 1 ? "s" : ""} in your collection` : "Loading..."}
          </p>
        </div>
        <Link
          to="/cameras/new"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Camera
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && cameras && cameras.length === 0 && (
        <EmptyState
          icon={Camera}
          title="No cameras yet"
          description="Add your first camera body to start building your collection."
          actionLabel="Add Camera"
          actionHref="/cameras/new"
        />
      )}

      {!isLoading && cameras && cameras.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cameras.map((camera) => (
            <CameraCard
              key={camera.ID}
              camera={camera}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
