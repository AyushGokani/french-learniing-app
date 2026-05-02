const postgres = require("postgres");

let client;
let schemaReady = false;

function json(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

function methodNotAllowed(response, methods = ["GET"]) {
  response.setHeader("Allow", methods.join(", "));
  return json(response, 405, { error: "Method not allowed" });
}

async function readBody(request) {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  if (typeof request.body === "string") {
    return JSON.parse(request.body || "{}");
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

function getDatabase() {
  if (!process.env.DATABASE_URL) {
    const error = new Error("DATABASE_URL is not configured.");
    error.statusCode = 503;
    throw error;
  }

  if (!client) {
    client = postgres(process.env.DATABASE_URL, {
      max: 1,
      ssl: process.env.POSTGRES_SSL === "false" ? false : "require",
    });
  }

  return client;
}

async function ensureSchema() {
  if (schemaReady) {
    return;
  }

  const sql = getDatabase();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      completed_activities INTEGER NOT NULL DEFAULT 0,
      exam_completed_drills INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS activity_events (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      activity_type TEXT NOT NULL,
      activity_key TEXT,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS test_attempts (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      exam TEXT NOT NULL,
      skill TEXT NOT NULL,
      prompt TEXT NOT NULL,
      response TEXT NOT NULL,
      model_answer TEXT NOT NULL,
      strategy TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS activity_events_user_id_created_at_idx
    ON activity_events (user_id, created_at DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS test_attempts_user_id_created_at_idx
    ON test_attempts (user_id, created_at DESC)
  `;

  schemaReady = true;
}

function publicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    completedActivities: Number(user.completed_activities) || 0,
    examCompletedDrills: Number(user.exam_completed_drills) || 0,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

module.exports = {
  ensureSchema,
  getDatabase,
  json,
  methodNotAllowed,
  publicUser,
  readBody,
};
