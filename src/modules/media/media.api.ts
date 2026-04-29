export async function uploadLessonImage(input: {
  apiBaseUrl: string;
  accessToken: string;
  file: File;
  lessonId?: string;
  type?: "image" | "thumbnail";
}) {
  const form = new FormData();
  form.append("file", input.file);
  if (input.lessonId) form.append("lessonId", input.lessonId);
  if (input.type) form.append("type", input.type);

  const res = await fetch(`${input.apiBaseUrl.replace(/\/$/, "")}/upload`, {
    method: "POST",
    headers: { authorization: `Bearer ${input.accessToken}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP_${res.status}`);
  }

  return (await res.json()) as {
    media: { id: string; url: string; publicId: string; type: "image" | "thumbnail"; lessonId?: string | null };
  };
}

