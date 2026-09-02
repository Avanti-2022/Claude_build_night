import { createServer, type IncomingMessage } from "node:http";
import { reviewWeek } from "../intelligence/reviewWeek";
import type { WeekInput } from "../intelligence/types";

const PORT = Number(process.env.PORT ?? 8787);

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

function isWeekInput(value: unknown): value is WeekInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    Array.isArray(candidate.events) &&
    Array.isArray(candidate.priorities) &&
    typeof candidate.boundaries === "object" &&
    candidate.boundaries !== null
  );
}

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/review-week") {
    try {
      const body = await readRequestBody(req);
      const parsed: unknown = body ? JSON.parse(body) : null;

      if (!isWeekInput(parsed)) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid WeekInput payload." }));
        return;
      }

      const observations = await reviewWeek(parsed);

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ observations }));
    } catch (error) {
      console.error("POST /api/review-week failed:", error);
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to review week." }));
    }
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "Not found." }));
});

server.listen(PORT, () => {
  console.log(`Compass intelligence server listening on http://localhost:${PORT}`);
});
