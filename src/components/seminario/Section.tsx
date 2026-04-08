import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  accent?: "blue" | "green";
  className?: string;
  children: React.ReactNode;
};

export function Section({
  id,
  title,
  subtitle,
  accent = "blue",
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
          <div
            className={cn(
              "hidden h-1 w-20 rounded-full sm:block",
              accent === "blue" ? "bg-sud-blue/80" : "bg-sud-green/80",
            )}
          />
        </div>
        {children}
      </div>
    </section>
  );
}

