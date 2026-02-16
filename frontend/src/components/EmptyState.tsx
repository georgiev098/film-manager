import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <Link
        to={actionHref}
        className="mt-6 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        {actionLabel}
      </Link>
    </div>
  );
}
