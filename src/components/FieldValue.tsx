import { ExternalLink, PlayCircle, Star } from "lucide-react";
import { isNullish } from "@/lib/companyData";

const URL_RE = /^https?:\/\/\S+$/i;
const VIDEO_RE = /(youtube\.com|youtu\.be|vimeo\.com)/i;
const RATING_RE = /^(\d+(\.\d+)?)\s*\/\s*(\d+)$/;

export function NotAvailable() {
  return <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Not Available</span>;
}

export function FieldValue({ value }: { value?: string | undefined }) {
  const v = (value ?? "").trim();
  if (isNullish(v)) return <NotAvailable />;

  if (URL_RE.test(v)) {
    const Icon = VIDEO_RE.test(v) ? PlayCircle : ExternalLink;
    return (
      <a href={v} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all text-link hover:underline">
        <Icon className="size-3.5 shrink-0" /> {v.replace(/^https?:\/\/(www\.)?/, "")}
      </a>
    );
  }

  const rating = v.match(RATING_RE);
  if (rating) {
    const pct = (Number(rating[1]) / Number(rating[3])) * 100;
    return (
      <span className="inline-flex items-center gap-2">
        <Star className="size-4 fill-regular text-regular" />
        <span className="font-medium">{v}</span>
        <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-regular" style={{ width: `${pct}%` }} /></span>
      </span>
    );
  }

  if (v.includes(";")) {
    const items = v.split(";").map((s) => s.trim()).filter(Boolean);
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => <span key={i} className="rounded-md border bg-secondary px-2 py-0.5 text-xs">{it}</span>)}
      </div>
    );
  }

  if (v.length < 60 && v.includes(",") && v.split(",").every((p) => p.trim().length > 0 && p.trim().length < 30) && !/\d,\d/.test(v)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {v.split(",").map((it, i) => <span key={i} className="rounded-md border bg-secondary px-2 py-0.5 text-xs">{it.trim()}</span>)}
      </div>
    );
  }

  return <p className="leading-relaxed">{v}</p>;
}
