const crypto = require("node:crypto");
const { ensureSchema, getDatabase, json, methodNotAllowed, publicUser, readBody } = require("./db");

const SESSION_COOKIE = "bonjour_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function createUserId() {
  return crypto.randomUUID();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto
    .createHash("sha256")
    .update(`${salt}:${password}`)
    .digest("hex");

  return { salt, passwordHash };
}

function verifyPassword(password, salt, expectedHash) {
  return hashPassword(password, salt).passwordHash === expectedHash;
}

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, part) => {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName) {
      return cookies;
    }

    cookies[rawName] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

function setSessionCookie(response, token) {
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`
  );
}

function clearSessionCookie(response) {
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
}

function getSessionToken(request) {
  return parseCookies(request.headers.cookie || "")[SESSION_COOKIE];
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();
  const sql = getDatabase();

  await sql`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (${tokenHash}, ${userId}, ${expiresAt})
  `;

  return token;
}

async function getSessionUser(request) {
  await ensureSchema();
  const token = getSessionToken(request);
  if (!token) {
    return null;
  }
  const tokenHash = hashSessionToken(token);
  const sql = getDatabase();

  const rows = await sql`
    SELECT users.id,
           users.name,
           users.email,
           users.completed_activities,
           users.exam_completed_drills,
           users.created_at,
           users.updated_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ${tokenHash}
      AND sessions.expires_at > now()
    LIMIT 1
  `;

  return rows[0] ? publicUser(rows[0]) : null;
}

async function deleteSession(request) {
  await ensureSchema();
  const token = getSessionToken(request);
  if (!token) {
    return;
  }
  const sql = getDatabase();
  const tokenHash = hashSessionToken(token);

  await sql`DELETE FROM sessions WHERE token_hash = ${tokenHash}`;
}

async function recordActivity(userId, activityType, metadata = {}) {
  const sql = getDatabase();
  await sql`
    INSERT INTO activity_events (user_id, activity_type, metadata)
    VALUES (${userId}, ${activityType}, ${sql.json(metadata)})
  `;
}

async function updateUserProgress(userId, { completedActivities }) {
  const sql = getDatabase();
  const [user] = await sql`
    UPDATE users
    SET completed_activities = ${completedActivities},
        updated_at = now()
    WHERE id = ${userId}
    RETURNING id, name, email, completed_activities, exam_completed_drills, created_at, updated_at
  `;

  return publicUser(user);
}

module.exports = {
  clearSessionCookie,
  createSession,
  createUserId,
  deleteSession,
  getSessionUser,
  hashPassword,
  json,
  methodNotAllowed,
  normalizeEmail,
  publicUser,
  readBody,
  recordActivity,
  setSessionCookie,
  updateUserProgress,
  verifyPassword,
};
