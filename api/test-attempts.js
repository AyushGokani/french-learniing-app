const { getSessionUser } = require("./_lib/auth");
const { ensureSchema, getDatabase, json, methodNotAllowed, publicUser, readBody } = require("./_lib/db");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return methodNotAllowed(response, ["POST"]);
  }

  try {
    await ensureSchema();
    const user = await getSessionUser(request);

    if (!user) {
      return json(response, 401, { error: "Login required." });
    }

    const sql = getDatabase();
    const {
      audioData,
      examCode,
      level,
      modelAnswer,
      prompt,
      responseText,
      section,
      skill,
      strategy,
    } = await readBody(request);

    if (!examCode || !skill || !prompt) {
      return json(response, 400, { error: "Exam, skill, and prompt are required." });
    }

    await sql`
      INSERT INTO exam_attempts (
        user_id,
        exam,
        skill,
        prompt,
        response,
        model_answer,
        strategy,
        level,
        section,
        audio_data
      )
      VALUES (
        ${user.id},
        ${examCode},
        ${skill},
        ${prompt},
        ${responseText || ""},
        ${modelAnswer || ""},
        ${strategy || ""},
        ${level || ""},
        ${section || ""},
        ${audioData || ""}
      )
    `;

    const [updatedUser] = await sql`
      UPDATE users
      SET exam_completed_drills = exam_completed_drills + 1,
          updated_at = now()
      WHERE id = ${user.id}
      RETURNING id, name, email, completed_activities, exam_completed_drills, created_at, updated_at
    `;

    return json(response, 201, { user: publicUser(updatedUser) });
  } catch (error) {
    const status = error.statusCode || 500;
    return json(response, status, {
      error: status === 503 ? error.message : "Could not save test attempt.",
    });
  }
};
