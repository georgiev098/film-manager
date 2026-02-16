import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCamera, useUpdateCamera, useDeleteCamera } from "@/hooks/useCameras";
import { formatDate } from "@/lib/utils";
import type { CameraFormat } from "@/types";
import {
  ArrowLeft,
  Camera as CameraIcon,
  Film,
  Calendar,
  Hash,
  StickyNote,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
} from "lucide-react";

export default function CameraDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: camera, isLoading, isError } = useCamera(Number(id));
  const updateCamera = useUpdateCamera();
  const deleteCamera = useDeleteCamera();

  const [editing, setEditing] = useState(false);

  // Edit form state
  const [brand, setBrand] = useState("");
  const [cameraModel, setCameraModel] = useState("");
  const [cameraFormat, setCameraFormat] = useState<CameraFormat>("35mm");
  const [year, setYear] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const startEditing = () => {
    if (!camera) return;
    setBrand(camera.brand);
    setCameraModel(camera.camera_model);
    setCameraFormat(camera.camera_format);
    setYear(camera.year?.toString() ?? "");
    setSerialNumber(camera.serial_number ?? "");
    setNotes(camera.notes ?? "");
    setImageUrl(camera.image_url ?? "");
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
    try {
      await updateCamera.mutateAsync({
        id: Number(id),
        payload: {
          brand,
          camera_model: cameraModel,
          camera_format: cameraFormat,
          year: year ? parseInt(year, 10) : null,
          serial_number: serialNumber || null,
          notes: notes || null,
          image_url: imageUrl || null,
        },
      });
      setEditing(false);
    } catch {
      setError("Failed to update camera.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this camera?")) return;
    try {
      await deleteCamera.mutateAsync(Number(id));
      navigate("/cameras");
    } catch {
      setError("Failed to delete camera.");
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

  if (isError || !camera) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          to="/cameras"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cameras
        </Link>
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <CameraIcon className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 text-lg font-medium text-foreground">Camera not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This camera may have been removed or the link is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/cameras"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cameras
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
        {camera.image_url ? (
          <img
            src={camera.image_url}
            alt={`${camera.brand} ${camera.camera_model}`}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <CameraIcon className="h-16 w-16 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground/40">No image uploaded</p>
          </div>
        )}
        <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm">
          <Film className="h-4 w-4 text-primary" />
          {camera.camera_format}
        </span>
      </div>

      {/* Content */}
      {editing ? (
        <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-foreground">Edit Camera</h2>
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
              <label htmlFor="edit-brand" className="text-sm font-medium text-foreground">
                Brand <span className="text-destructive">*</span>
              </label>
              <input id="edit-brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required className={inputClasses} />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-model" className="text-sm font-medium text-foreground">
                Model <span className="text-destructive">*</span>
              </label>
              <input id="edit-model" type="text" value={cameraModel} onChange={(e) => setCameraModel(e.target.value)} required className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="edit-format" className="text-sm font-medium text-foreground">
                Format <span className="text-destructive">*</span>
              </label>
              <select id="edit-format" value={cameraFormat} onChange={(e) => setCameraFormat(e.target.value as CameraFormat)} className={inputClasses}>
                <option value="35mm">35mm</option>
                <option value="120mm">120mm (Medium Format)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-year" className="text-sm font-medium text-foreground">Year</label>
              <input id="edit-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} min={1800} max={2026} className={inputClasses} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="edit-serial" className="text-sm font-medium text-foreground">Serial Number</label>
              <input id="edit-serial" type="text" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className={inputClasses} />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-image" className="text-sm font-medium text-foreground">Image URL</label>
              <input id="edit-image" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputClasses} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-notes" className="text-sm font-medium text-foreground">Notes</label>
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
              disabled={updateCamera.isPending}
              className="flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {updateCamera.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save Changes
            </button>
            <button type="button" onClick={cancelEditing} className="flex h-10 items-center rounded-lg border border-border px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Title section */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">{camera.brand}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{camera.camera_model}</h1>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Film className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Format</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{camera.camera_format}</p>
              </div>
            </div>

            {camera.year && (
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Year</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{camera.year}</p>
                </div>
              </div>
            )}

            {camera.serial_number && (
              <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Hash className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Serial Number</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">{camera.serial_number}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {camera.notes && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Notes</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{camera.notes}</p>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-6 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>Added {formatDate(camera.CreatedAt)}</span>
            <span>Updated {formatDate(camera.UpdatedAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
