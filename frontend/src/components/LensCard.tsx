import { Link } from "react-router-dom";
import type { Lens } from "@/types";
import { formatDate, focalLengthDisplay } from "@/lib/utils";
import { CircleDot, Trash2, Zap } from "lucide-react";

interface LensCardProps {
  lens: Lens;
  onDelete?: (id: number) => void;
}

export default function LensCard({ lens, onDelete }: LensCardProps) {
  return (
    <Link
      to={`/lenses/${lens.ID}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/30"
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-[4/3] bg-secondary/50">
        {lens.image_url ? (
          <img
            src={lens.image_url}
            alt={`${lens.manufacturer} ${focalLengthDisplay(lens.min_focal_length, lens.max_focal_length)}`}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CircleDot className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {/* Type Badge */}
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {lens.lens_type}
        </span>
        {lens.image_stabilization && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground">
            <Zap className="h-3 w-3" />
            IS
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {lens.manufacturer}
          </p>
          <h3 className="mt-0.5 text-lg font-semibold text-foreground">
            {focalLengthDisplay(lens.min_focal_length, lens.max_focal_length)}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-secondary px-2 py-1">
            {lens.max_aperture}
          </span>
          <span className="rounded-md bg-secondary px-2 py-1">
            {lens.mount}
          </span>
        </div>

        {lens.notes && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {lens.notes}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Added {formatDate(lens.CreatedAt)}
          </span>
          {onDelete && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(lens.ID); }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              aria-label={`Delete ${lens.manufacturer} lens`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
