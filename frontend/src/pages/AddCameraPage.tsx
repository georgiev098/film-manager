import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateCamera } from "@/hooks/useCameras";
import type { CameraFormat } from "@/types";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AddCameraPage() {
  const navigate = useNavigate();
  const createCamera = useCreateCamera();

  const [brand, setBrand] = useState("");
  const [cameraModel, setCameraModel] = useState("");
  const [cameraFormat, setCameraFormat] = useState<CameraFormat>("35mm");
  const [year, setYear] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createCamera.mutateAsync({
        brand,
        camera_model: cameraModel,
        camera_format: cameraFormat,
        year: year ? parseInt(year, 10) : null,
        serial_number: serialNumber || null,
        notes: notes || null,
        image_url: imageUrl || null,
      });
      navigate("/cameras");
    } catch {
      setError("Failed to add camera. Please check your inputs.");
    }
  };

  const inputClasses =
    "flex h-11 w-full rounded-lg border border-input bg-secondary/50 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/cameras"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Back to cameras"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Add Camera
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a new camera body to your collection
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand & Model */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="brand" className="text-sm font-medium text-foreground">
              Brand <span className="text-destructive">*</span>
            </label>
            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Nikon, Canon, Leica"
              required
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium text-foreground">
              Model <span className="text-destructive">*</span>
            </label>
            <input
              id="model"
              type="text"
              value={cameraModel}
              onChange={(e) => setCameraModel(e.target.value)}
              placeholder="e.g. FM2, AE-1, M6"
              required
              className={inputClasses}
            />
          </div>
        </div>

        {/* Format & Year */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="format" className="text-sm font-medium text-foreground">
              Format <span className="text-destructive">*</span>
            </label>
            <select
              id="format"
              value={cameraFormat}
              onChange={(e) => setCameraFormat(e.target.value as CameraFormat)}
              className={inputClasses}
            >
              <option value="35mm">35mm</option>
              <option value="120mm">120mm (Medium Format)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-medium text-foreground">
              Year
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 1984"
              min={1800}
              max={2026}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Serial & Image URL */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="serial" className="text-sm font-medium text-foreground">
              Serial Number
            </label>
            <input
              id="serial"
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g. 2847593"
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium text-foreground">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className={inputClasses}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-foreground">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this camera..."
            rows={4}
            maxLength={500}
            className="flex w-full rounded-lg border border-input bg-secondary/50 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">{notes.length}/500</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 border-t border-border pt-6">
          <button
            type="submit"
            disabled={createCamera.isPending}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {createCamera.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Add Camera
          </button>
          <Link
            to="/cameras"
            className="flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
