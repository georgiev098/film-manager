import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLens, useUpdateLens, useDeleteLens } from "@/hooks/useLenses";
import { formatDate, focalLengthDisplay } from "@/lib/utils";
import type { LensType } from "@/types";
import {
  ArrowLeft,
  CircleDot,
  Zap,
  Target,
  Aperture,
  Settings,
  StickyNote,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LensDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: lens, isLoading, isError } = useLens(Number(id));
  const updateLens = useUpdateLens();
  const deleteLens = useDeleteLens();

  const [editing, setEditing] = useState(false);

  // Edit form state
  const [manufacturer, setManufacturer] = useState("");
  const [lensType, setLensType] = useState<LensType>("analog");
  const [imageStabilization, setImageStabilization] = useState(false);
  const [minFocal, setMinFocal] = useState("");
  const [maxFocal, setMaxFocal] = useState("");
  const [minAperture, setMinAperture] = useState("");
  const [maxAperture, setMaxAperture] = useState("");
  const [mount, setMount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const startEditing = () => {
    if (!lens) return;
    setManufacturer(lens.manufacturer);
    setLensType(lens.lens_type);
    setImageStabilization(lens.image_stabilization);
    setMinFocal(lens.min_focal_length.toString());
    setMaxFocal(lens.max_focal_length.toString());
    setMinAperture(lens.min_aperture);
    setMaxAperture(lens.max_aperture);
    setMount(lens.mount);
    setImageUrl(lens.image_url ?? "");
    setNotes(lens.notes ?? "");
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const minFocalNum = parseInt(minFocal, 10);
    const maxFocalNum = parseInt(maxFocal, 10);
    if (maxFocalNum < minFocalNum) {
      setError("Max focal length cannot be less than min focal length.");
      toast({
        variant: "destructive",
        title: "Invalid Focal Length",
        description: "Max focal length cannot be less than min focal length.",
      });
      return;
    }

    try {
      await updateLens.mutateAsync({
        id: Number(id),
        payload: {
          manufacturer,
          lens_type: lensType,
          image_stabilization: imageStabilization,
          min_focal_length: minFocalNum,
          max_focal_length: maxFocalNum,
          min_aperture: minAperture,
          max_aperture: maxAperture,
          mount,
          image_url: imageUrl || null,
          notes: notes || null,
        },
      });
      setEditing(false);
      toast({
        title: "Lens updated",
        description: "Your changes have been saved successfully.",
      });
    } catch {
      setError("Failed to update lens.");
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem saving your changes.",
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lens?")) return;
    try {
      await deleteLens.mutateAsync(Number(id));
      toast({
        title: "Lens deleted",
        description: "The lens has been removed from your vault.",
      });
      navigate("/lenses");
    } catch {
      setError("Failed to delete lens.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the lens. Please try again.",
      });
    }
  };

  const inputClasses =
    "flex h-11 w-full rounded-lg border border-input bg-secondary/50 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !lens) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          to="/lenses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lenses
        </Link>
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <CircleDot className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-lg font-medium text-foreground">
            Lens not found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This lens may have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  const focalLabel = focalLengthDisplay(
    lens.min_focal_length,
    lens.max_focal_length,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/lenses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lenses
        </Link>
        {!editing && (
          <div className="flex items-center gap-2">
            <button
              onClick={startEditing}
              className="flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex h-9 items-center gap-2 rounded-lg border border-destructive/30 px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Hero image / placeholder */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-secondary/50">
        {lens.image_url ? (
          <img
            src={lens.image_url}
            alt={`${lens.manufacturer} ${focalLabel}`}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <CircleDot className="h-16 w-16 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground/40">
              No image uploaded
            </p>
          </div>
        )}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm">
            {lens.lens_type}
          </span>
          {lens.image_stabilization && (
            <span className="flex items-center gap-1.5 rounded-lg bg-primary/90 px-3 py-1.5 text-sm font-medium text-primary-foreground">
              <Zap className="h-3.5 w-3.5" />
              IS
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-foreground">Edit Lens</h2>
            <button
              type="button"
              onClick={cancelEditing}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="edit-mfr"
                className="text-sm font-medium text-foreground"
              >
                Manufacturer <span className="text-destructive">*</span>
              </label>
              <input
                id="edit-mfr"
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-type"
                className="text-sm font-medium text-foreground"
              >
                Lens Type <span className="text-destructive">*</span>
              </label>
              <select
                id="edit-type"
                value={lensType}
                onChange={(e) => setLensType(e.target.value as LensType)}
                className={inputClasses}
              >
                <option value="analog">Analog</option>
                <option value="digital">Digital</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="edit-min-focal"
                className="text-sm font-medium text-foreground"
              >
                Min Focal Length (mm){" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                id="edit-min-focal"
                type="number"
                value={minFocal}
                onChange={(e) => setMinFocal(e.target.value)}
                required
                min={1}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-max-focal"
                className="text-sm font-medium text-foreground"
              >
                Max Focal Length (mm){" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                id="edit-max-focal"
                type="number"
                value={maxFocal}
                onChange={(e) => setMaxFocal(e.target.value)}
                required
                min={1}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="edit-max-ap"
                className="text-sm font-medium text-foreground"
              >
                Max Aperture (widest){" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                id="edit-max-ap"
                type="text"
                value={maxAperture}
                onChange={(e) => setMaxAperture(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-min-ap"
                className="text-sm font-medium text-foreground"
              >
                Min Aperture (narrowest){" "}
                <span className="text-destructive">*</span>
              </label>
              <input
                id="edit-min-ap"
                type="text"
                value={minAperture}
                onChange={(e) => setMinAperture(e.target.value)}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-mount"
              className="text-sm font-medium text-foreground"
            >
              Mount <span className="text-destructive">*</span>
            </label>
            <input
              id="edit-mount"
              type="text"
              value={mount}
              onChange={(e) => setMount(e.target.value)}
              required
              className={inputClasses}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={imageStabilization}
              onClick={() => setImageStabilization(!imageStabilization)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${imageStabilization ? "bg-primary" : "bg-secondary"}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-foreground shadow-sm transition-transform ${imageStabilization ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <label className="text-sm font-medium text-foreground">
              Image Stabilization
            </label>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-image"
              className="text-sm font-medium text-foreground"
            >
              Image URL
            </label>
            <input
              id="edit-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="edit-notes"
              className="text-sm font-medium text-foreground"
            >
              Notes
            </label>
            <textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              maxLength={500}
              className="flex w-full rounded-lg border border-input bg-secondary/50 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">{notes.length}/500</p>
          </div>

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <button
              type="submit"
              disabled={updateLens.isPending}
              className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {updateLens.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save Changes
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="flex h-10 items-center rounded-lg border border-border px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Title section */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              {lens.manufacturer}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              {focalLabel}
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              {lens.max_aperture}
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Focal Length
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {focalLabel}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Aperture className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Aperture Range
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {lens.max_aperture} - {lens.min_aperture}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Mount
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {lens.mount}
                </p>
              </div>
            </div>
          </div>

          {/* Additional info badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground capitalize">
              {lens.lens_type}
            </span>
            {lens.image_stabilization && (
              <span className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Zap className="h-3 w-3" />
                Image Stabilization
              </span>
            )}
          </div>

          {/* Notes */}
          {lens.notes && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Notes</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {lens.notes}
              </p>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-6 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>Added {formatDate(lens.CreatedAt)}</span>
            <span>Updated {formatDate(lens.UpdatedAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
