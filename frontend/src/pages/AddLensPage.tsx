import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateLens } from "@/hooks/useLenses";
import type { LensType } from "@/types";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AddLensPage() {
  const navigate = useNavigate();
  const createLens = useCreateLens();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const minFocalNum = parseInt(minFocal, 10);
    const maxFocalNum = parseInt(maxFocal, 10);

    if (maxFocalNum < minFocalNum) {
      setError("Max focal length cannot be less than min focal length.");
      return;
    }

    try {
      await createLens.mutateAsync({
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
      });
      navigate("/lenses");
    } catch {
      setError("Failed to add lens. Please check your inputs.");
    }
  };

  const inputClasses =
    "flex h-11 w-full rounded-lg border border-input bg-secondary/50 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/lenses"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Back to lenses"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Add Lens
          </h1>
          <p className="text-sm text-muted-foreground">
            Add a new lens to your collection
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Manufacturer & Type */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="manufacturer" className="text-sm font-medium text-foreground">
              Manufacturer <span className="text-destructive">*</span>
            </label>
            <input
              id="manufacturer"
              type="text"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="e.g. Nikon, Canon, Zeiss"
              required
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lensType" className="text-sm font-medium text-foreground">
              Lens Type <span className="text-destructive">*</span>
            </label>
            <select
              id="lensType"
              value={lensType}
              onChange={(e) => setLensType(e.target.value as LensType)}
              className={inputClasses}
            >
              <option value="analog">Analog</option>
              <option value="digital">Digital</option>
            </select>
          </div>
        </div>

        {/* Focal Length Range */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="minFocal" className="text-sm font-medium text-foreground">
              Min Focal Length (mm) <span className="text-destructive">*</span>
            </label>
            <input
              id="minFocal"
              type="number"
              value={minFocal}
              onChange={(e) => setMinFocal(e.target.value)}
              placeholder="e.g. 50"
              required
              min={1}
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="maxFocal" className="text-sm font-medium text-foreground">
              Max Focal Length (mm) <span className="text-destructive">*</span>
            </label>
            <input
              id="maxFocal"
              type="number"
              value={maxFocal}
              onChange={(e) => setMaxFocal(e.target.value)}
              placeholder="e.g. 200"
              required
              min={1}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Aperture Range */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="maxAperture" className="text-sm font-medium text-foreground">
              Max Aperture (widest) <span className="text-destructive">*</span>
            </label>
            <input
              id="maxAperture"
              type="text"
              value={maxAperture}
              onChange={(e) => setMaxAperture(e.target.value)}
              placeholder="e.g. f/2.8"
              required
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="minAperture" className="text-sm font-medium text-foreground">
              Min Aperture (narrowest) <span className="text-destructive">*</span>
            </label>
            <input
              id="minAperture"
              type="text"
              value={minAperture}
              onChange={(e) => setMinAperture(e.target.value)}
              placeholder="e.g. f/22"
              required
              className={inputClasses}
            />
          </div>
        </div>

        {/* Mount */}
        <div className="space-y-2">
          <label htmlFor="mount" className="text-sm font-medium text-foreground">
            Mount <span className="text-destructive">*</span>
          </label>
          <input
            id="mount"
            type="text"
            value={mount}
            onChange={(e) => setMount(e.target.value)}
            placeholder="e.g. F-mount, EF, M42, E-mount"
            required
            className={inputClasses}
          />
        </div>

        {/* Image Stabilization Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={imageStabilization}
            onClick={() => setImageStabilization(!imageStabilization)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              imageStabilization ? "bg-primary" : "bg-secondary"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-foreground shadow-sm transition-transform ${
                imageStabilization ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <label className="text-sm font-medium text-foreground">
            Image Stabilization
          </label>
        </div>

        {/* Image URL */}
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

        {/* Notes */}
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-foreground">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this lens..."
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
            disabled={createLens.isPending}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {createLens.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Add Lens
          </button>
          <Link
            to="/lenses"
            className="flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
