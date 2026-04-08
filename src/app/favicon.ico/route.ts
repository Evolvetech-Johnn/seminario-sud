import { NextResponse } from "next/server";

export async function GET() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#1E40AF"/>
      <stop offset="1" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <path d="M18 22h28v6H18zm0 14h28v6H18z" fill="rgba(255,255,255,0.16)"/>
  <text x="32" y="41" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="20" font-weight="800" text-anchor="middle" fill="#ffffff">SUD</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
