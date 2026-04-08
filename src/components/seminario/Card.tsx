import Image from "next/image";

import { cn } from "@/lib/cn";

type CardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  tone?: "default" | "spiritual";
  className?: string;
};

export function Card({
  title,
  description,
  icon,
  imageSrc,
  imageAlt,
  tone = "default",
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft-lg",
        tone === "spiritual"
          ? "border-sud-green/25 ring-1 ring-sud-green/10"
          : "border-slate-200",
        className,
      )}
    >
      {imageSrc ? (
        <div className="relative h-40 w-full overflow-hidden bg-sud-gray">
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-900/0 to-slate-900/0" />
        </div>
      ) : null}

      <div className="p-5">
        <div className="flex items-start gap-3">
          {icon ? (
            <div
              className={cn(
                "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                tone === "spiritual"
                  ? "bg-sud-green/10 text-sud-green"
                  : "bg-sud-blue/10 text-sud-blue",
              )}
            >
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            <div className="text-base font-bold text-slate-900">{title}</div>
            <div className="mt-1 text-sm leading-relaxed text-slate-600">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
