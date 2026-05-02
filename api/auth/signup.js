const {
  createSession,
  createUserId,
  hashPassword,
  json,
  methodNotAllowed,
  normalizeEmail,
  publicUser,
  setSessionCookie,
} = require("../_lib/auth");
const { ensureSchema, getDatabase, readBody } = require("../_lib/db");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return methodNotAllowed(response, ["POST"]);
  }

  try {
    await ensureSchema();
    const { name, email, password } = await readBody(request);
    const trimmedName = String(name || "").trim();
    const normalizedEmail = normalizeEmail(email);
    const sql = getDatabase();

    if (!trimmedName || !normalizedEmail || String(password || "").length < 6) {
      return json(response, 400, {
        error: "Name, email, and a password of at least 6 characters are required.",
      });
    }

    const { salt, passwordHash } = hashPassword(password);
    const [user] = await sql`
      INSERT INTO users (id, name, email, password_hash, password_salt)
      VALUES (${createUserId()}, ${trimmedName}, ${normalizedEmail}, ${passwordHash}, ${salt})
      RETURNING id, name, email, completed_activities, exam_completed_drills, created_at, updated_at
    `;
    const token = await createSession(user.id);
    setSessionCookie(response, token);

    return json(response, 201, {
      user: publicUser(user),
    });
  } catch (error) {
    if (error.statusCode === 503) {
      return json(response, 503, { error: error.message });
    }

    if (error.code === "23505") {
      return json(response, 409, { error: "An account with this email already exists." });
    }

    return json(response, 500, { error: "Account creation failed." });
  }
};
