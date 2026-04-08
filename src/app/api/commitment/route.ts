import { NextResponse } from "next/server";

type CommitmentPayload = {
  lessonSlug?: unknown;
  plan?: {
    before?: unknown;
    during?: unknown;
    after?: unknown;
  };
};

function asLimitedString(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLen);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as CommitmentPayload | null;
  const lessonSlug =
    body && typeof body.lessonSlug === "string" ? body.lessonSlug : null;

  if (!lessonSlug) {
    return NextResponse.json(
      { ok: false, error: "lessonSlug obrigatório" },
      { status: 400 },
    );
  }

  const plan = {
    before: asLimitedString(body?.plan?.before, 2000),
    during: asLimitedString(body?.plan?.during, 2000),
    after: asLimitedString(body?.plan?.after, 2000),
  };

  return NextResponse.json({
    ok: true,
    lessonSlug,
    plan,
    savedAt: new Date().toISOString(),
  });
}

