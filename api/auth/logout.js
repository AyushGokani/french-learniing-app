const { clearSessionCookie, deleteSession, json, methodNotAllowed } = require("../_lib/auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return methodNotAllowed(response, ["POST"]);
  }

  try {
    await deleteSession(request);
    clearSessionCookie(response);
    return json(response, 200, { success: true });
  } catch (error) {
    return json(response, error.statusCode || 500, {
      error: error.statusCode ? error.message : "Logout failed.",
    });
  }
};
