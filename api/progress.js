const {
  getSessionUser,
  json,
  methodNotAllowed,
  readBody,
  recordActivity,
  updateUserProgress,
} = require("./_lib/auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return methodNotAllowed(response, ["POST"]);
  }

  try {
    const user = await getSessionUser(request);

    if (!user) {
      return json(response, 401, { error: "Authentication required." });
    }

    const body = await readBody(request);
    const completedActivities = Number(body.completedActivities) || 0;
    const updatedUser = await updateUserProgress(user.id, { completedActivities });
    await recordActivity(user.id, "progress_update", { completedActivities });

    return json(response, 200, { user: updatedUser });
  } catch (error) {
    return json(response, error.statusCode || 500, {
      error: error.statusCode ? error.message : "Progress could not be saved.",
    });
  }
};
