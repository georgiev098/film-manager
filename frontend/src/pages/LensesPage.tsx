import { Link } from "react-router-dom";
import { useLenses, useDeleteLens } from "@/hooks/useLenses";
import LensCard from "@/components/LensCard";
import EmptyState from "@/components/EmptyState";
import { CircleDot, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LensesPage() {
  const { data: lenses, isLoading } = useLenses();
  const { toast } = useToast();
  const deleteMutation = useDeleteLens();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this lens?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Lens deleted",
            description: "The lens has been removed from your vault.",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error instanceof Error ? error.message : "Failed to delete lens.",
          });
        },
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Lenses
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lenses
              ? `${lenses.length} ${lenses.length !== 1 ? "lenses" : "lens"} in your collection`
              : "Loading..."}
          </p>
        </div>
        <Link
          to="/lenses/new"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Lens
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && lenses && lenses.length === 0 && (
        <EmptyState
          icon={CircleDot}
          title="No lenses yet"
          description="Add your first lens to start building your collection."
          actionLabel="Add Lens"
          actionHref="/lenses/new"
        />
      )}

      {!isLoading && lenses && lenses.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lenses.map((lens) => (
            <LensCard key={lens.ID} lens={lens} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
