import { Link } from "react-router-dom";
import type { Camera } from "@/types";
import { formatDate } from "@/lib/utils";
import { Camera as CameraIcon, Trash2, Film } from "lucide-react";

interface CameraCardProps {
  camera: Camera;
  onDelete?: (id: number) => void;
}

export default function CameraCard({ camera, onDelete }: CameraCardProps) {
  return (
    <Link
      to={`/cameras/${camera.ID}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/30"
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-[4/3] bg-secondary/50">
        {camera.image_url ? (
          <img
            src={camera.image_url}
            alt={`${camera.brand} ${camera.camera_model}`}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CameraIcon className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {/* Format Badge */}
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          <Film className="h-3 w-3" />
          {camera.camera_format}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {camera.brand}
          </p>
          <h3 className="mt-0.5 text-lg font-semibold text-foreground">
            {camera.camera_model}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {camera.year && (
            <span className="rounded-md bg-secondary px-2 py-1">
              {camera.year}
            </span>
          )}
          {camera.serial_number && (
            <span className="rounded-md bg-secondary px-2 py-1 font-mono">
              SN: {camera.serial_number}
            </span>
          )}
        </div>

        {camera.notes && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {camera.notes}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Added {formatDate(camera.CreatedAt)}
          </span>
          {onDelete && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(camera.ID); }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              aria-label={`Delete ${camera.brand} ${camera.camera_model}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
