const serverApi = {
  async request(path, options = {}) {
    const response = await fetch(path, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.error || "Server request failed.");
      error.status = response.status;
      throw error;
    }

    return data;
  },

  signup({ name, email, password }) {
    return this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login({ email, password }) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return this.request("/api/auth/logout", { method: "POST" });
  },

  me() {
    return this.request("/api/auth/me");
  },

  saveProgress(completedActivities) {
    return this.request("/api/progress", {
      method: "POST",
      body: JSON.stringify({ completedActivities }),
    });
  },

  saveTestAttempt(attempt) {
    return this.request("/api/test-attempts", {
      method: "POST",
      body: JSON.stringify(attempt),
    });
  },
};

function toUnavailableResult(error) {
  return {
    error: error.message,
    isUnavailable: error.status === 503 || error.name === "TypeError",
  };
}

async function safeRequest(callback) {
  try {
    return await callback();
  } catch (error) {
    return toUnavailableResult(error);
  }
}

window.BonjourApi = {
  signup(credentials) {
    return safeRequest(() => serverApi.signup(credentials));
  },

  login(credentials) {
    return safeRequest(() => serverApi.login(credentials));
  },

  logout() {
    return safeRequest(() => serverApi.logout());
  },

  getCurrentUser() {
    return safeRequest(() => serverApi.me());
  },

  saveProgress(progress) {
    return safeRequest(() => serverApi.saveProgress(progress));
  },

  saveTestAttempt(attempt) {
    return safeRequest(() => serverApi.saveTestAttempt(attempt));
  },

  isServerUser(user) {
    return Boolean(user?.id);
  },
};
