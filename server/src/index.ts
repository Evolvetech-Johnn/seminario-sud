import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { analyticsRouter } from "./modules/analytics/analytics.routes";
import { attendanceRouter } from "./modules/attendance/attendance.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { lessonsRouter } from "./modules/lessons/lessons.routes";
import { mediaRouter } from "./modules/media/media.routes";
import { usersRouter } from "./modules/users/users.routes";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/lessons", lessonsRouter);
app.use("/", mediaRouter);
app.use("/attendance", attendanceRouter);
app.use("/dashboard", dashboardRouter);
app.use("/analytics", analyticsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : "INTERNAL_ERROR";
  return res.status(500).json({ error: "INTERNAL_ERROR", message });
});

app.listen(env.PORT, () => {
  process.stdout.write(`API listening on http://localhost:${env.PORT}\n`);
});
