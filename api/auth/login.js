const {
  createSession,
  json,
  methodNotAllowed,
  normalizeEmail,
  publicUser,
  readBody,
  setSessionCookie,
  verifyPassword,
} = require("../_lib/auth");
const { ensureSchema, getDatabase } = require("../_lib/db");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return methodNotAllowed(response, ["POST"]);
  }

  try {
    await ensureSchema();
    const sql = getDatabase();
    const { email, password } = await readBody(request);
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return json(response, 400, { error: "Email and password are required." });
    }

    const users = await sql`
      SELECT *
      FROM users
      WHERE email = ${normalizedEmail}
      LIMIT 1
    `;
    const user = users[0];

    if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
      return json(response, 401, { error: "Invalid email or password." });
    }

    const token = await createSession(user.id);
    setSessionCookie(response, token);

    return json(response, 200, { user: publicUser(user) });
  } catch (error) {
    const status = error.statusCode || 500;
    return json(response, status, {
      error: status === 503 ? error.message : "Login failed.",
    });
  }
};
