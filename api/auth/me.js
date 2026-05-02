const { getSessionUser } = require("../_lib/auth");
const { json, methodNotAllowed } = require("../_lib/db");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    return methodNotAllowed(response);
  }

  try {
    const user = await getSessionUser(request);
    if (!user) {
      return json(response, 401, { error: "Not authenticated." });
    }

    return json(response, 200, { user });
  } catch (error) {
    return json(response, error.statusCode || 500, { error: error.message || "Could not load user." });
  }
};
