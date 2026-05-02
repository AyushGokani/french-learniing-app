const examPractice = {
  TEF: {
    name: "TEF",
    title: "Test d'Evaluation de Francais",
    description: "Immigration, citizenship, work, and academic French practice.",
    level: "A2-C1",
    duration: "Fast-paced modules",
    skills: ["Listening", "Reading", "Speaking", "Writing"],
    drills: [
      {
        skill: "Listening",
        prompt: "You hear: \"Le train pour Lyon partira avec dix minutes de retard.\" What changed?",
        task: "Answer in English or French with the key information.",
        answer: "The train to Lyon will leave ten minutes late.",
        strategy: "Listen for time expressions, destination names, and delay words like retard.",
      },
      {
        skill: "Writing",
        prompt: "Should people learn French before moving to Canada?",
        task: "Write 3-4 sentences with an opinion, reason, example, and conclusion.",
        answer:
          "Use opinion + reason + example + conclusion: A mon avis..., parce que..., par exemple..., donc...",
        strategy: "TEF writing rewards structure, connectors, and clear everyday arguments.",
      },
      {
        skill: "Speaking",
        prompt: "Convince a colleague to join a French conversation club after work.",
        task: "Prepare a persuasive 45-second speaking outline.",
        answer: "Start with the benefit, add one practical detail, then invite them directly.",
        strategy: "For TEF speaking, organize persuasion with problem, benefit, example, action.",
      },
    ],
  },
  TCF: {
    name: "TCF",
    title: "Test de connaissance du francais",
    description: "Placement, immigration, and general language certification practice.",
    level: "A1-C2",
    duration: "Adaptive sections",
    skills: ["Listening", "Reading", "Language structures", "Speaking"],
    drills: [
      {
        skill: "Reading",
        prompt: "A notice says: \"Fermeture exceptionnelle ce lundi.\" What does it mean?",
        task: "Explain the notice in one sentence.",
        answer: "The place is exceptionally closed this Monday.",
        strategy: "For TCF notices, identify the action first: opening, closing, delay, or cancellation.",
      },
      {
        skill: "Language structures",
        prompt: "Choose the correct sentence: \"Je vais ___ boulangerie.\"",
        task: "Type the missing words and explain why.",
        answer: "a la - Je vais a la boulangerie.",
        strategy: "Review contractions and prepositions: a la, au, aux, de la, du, des.",
      },
      {
        skill: "Listening",
        prompt: "You hear a voicemail asking you to call back before 18h.",
        task: "Write the action and deadline.",
        answer: "You need to call back before 6 p.m.",
        strategy: "TCF audio often tests action + time + person. Capture those three details.",
      },
    ],
  },
  DELF: {
    name: "DELF",
    title: "Diplome d'etudes en langue francaise",
    description: "Official CEFR diploma practice from A1 to B2.",
    level: "A1-B2",
    duration: "Level-based diploma",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
    drills: [
      {
        skill: "Speaking",
        prompt: "Introduce yourself for a DELF A2 speaking task: name, city, work/studies, hobbies.",
        task: "Say or type a natural answer you could give to an examiner.",
        answer: "Bonjour, je m'appelle..., j'habite a..., je travaille/etudie..., et j'aime...",
        strategy: "Prepare reusable introductions, then adapt them naturally to the examiner's question.",
      },
      {
        skill: "Writing",
        prompt: "Write a short email inviting a friend to your birthday dinner.",
        task: "Include greeting, invitation, date/time/place, one detail, and a closing.",
        answer: "Bonjour..., je t'invite..., samedi a 19h..., chez moi..., a bientot.",
        strategy: "DELF writing tasks often grade task completion as much as grammar.",
      },
      {
        skill: "Reading",
        prompt: "A poster advertises a free concert in the park on Sunday afternoon.",
        task: "Identify who can attend, where it is, and when it happens.",
        answer: "Anyone can attend a free concert in the park on Sunday afternoon.",
        strategy: "For DELF reading, scan for public, place, time, price, and purpose.",
      },
    ],
  },
};

const DB_NAME = "bonjourBuddyDb";
const DB_VERSION = 1;
const USER_STORE = "users";
const SESSION_KEY = "bonjourBuddySession";
let db;

const state = {
  activeUser: null,
  currentExamKey: "TEF",
  currentDrillIndex: 0,
  completedDrills: 0,
  currentDrillCompleted: false,
  isLoggedIn: false,
};

const examGrid = document.querySelector("#test-path-grid");
const skillButtons = document.querySelector("#test-skill-list");
const accessTitle = document.querySelector("#test-access-title");
const accessCopy = document.querySelector("#test-access-copy");
const authPanel = document.querySelector("#test-auth-panel");
const loginForm = document.querySelector("#test-login-form");
const signupForm = document.querySelector("#test-signup-form");
const authMessage = document.querySelector("#test-auth-message");
const sessionPanel = document.querySelector("#test-session-panel");
const sessionName = document.querySelector("#test-session-name");
const logoutButton = document.querySelector("#test-logout-button");
const drillTitle = document.querySelector("#test-drill-title");
const drillSkill = document.querySelector("#test-drill-skill");
const drillPrompt = document.querySelector("#test-drill-prompt");
const drillTask = document.querySelector("#test-drill-task");
const drillResponse = document.querySelector("#test-response");
const drillFeedback = document.querySelector("#test-feedback");
const checkButton = document.querySelector("#show-model-answer");
const nextButton = document.querySelector("#next-test-drill");
const completedCount = document.querySelector("#completed-test-count");
const activeExam = document.querySelector("#active-test-title");

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(USER_STORE)) {
        const userStore = database.createObjectStore(USER_STORE, { keyPath: "email" });
        userStore.createIndex("createdAt", "createdAt");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getUser(email) {
  const transaction = db.transaction(USER_STORE, "readonly");
  const store = transaction.objectStore(USER_STORE);

  return requestToPromise(store.get(normalizeEmail(email)));
}

function saveUser(user) {
  const transaction = db.transaction(USER_STORE, "readwrite");
  const store = transaction.objectStore(USER_STORE);

  return requestToPromise(store.put(user));
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function createSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function setAuthMessage(message, type = "") {
  authMessage.textContent = message;
  authMessage.className = type ? `auth-message ${type}` : "auth-message";
}

function getCurrentExam() {
  return examPractice[state.currentExamKey];
}

function getCurrentDrill() {
  return getCurrentExam().drills[state.currentDrillIndex];
}

function updateStats() {
  const drill = getCurrentDrill();
  completedCount.textContent = String(state.completedDrills);
  activeExam.textContent = state.currentExamKey;
  drillSkill.textContent = drill.skill;
  if (state.activeUser) {
    state.activeUser.examCompletedDrills = state.completedDrills;
    saveUser(state.activeUser).catch(() => {
      setAuthMessage("Exam progress could not be saved right now.", "error");
    });
  }
}

function updateAuthGate() {
  const locked = !state.isLoggedIn;
  accessTitle.textContent = locked ? "Sign in to unlock test modules" : "Test modules unlocked";
  accessCopy.textContent = locked
    ? "Test drills, model answers, and exam progress are available after login so your practice can be saved to your learner profile."
    : "You are signed in. Choose an exam path and complete drills to build your exam readiness.";
  authPanel.classList.toggle("hidden", !locked);
  sessionPanel.classList.toggle("hidden", locked);
  sessionName.textContent = state.activeUser ? state.activeUser.name : "Learner";
  drillResponse.disabled = locked;
  checkButton.disabled = locked;
  nextButton.disabled = locked;
}

async function setActiveUser(user) {
  state.activeUser = user;
  state.isLoggedIn = true;
  state.completedDrills = Number(user.examCompletedDrills) || 0;
  localStorage.setItem(SESSION_KEY, user.email);
  setAuthMessage("");
  renderDrill();
}

async function restoreSession() {
  const sessionEmail = localStorage.getItem(SESSION_KEY);

  if (!sessionEmail) {
    renderDrill();
    return;
  }

  const user = await getUser(sessionEmail);
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    renderDrill();
    return;
  }

  await setActiveUser(user);
}

async function handleSignup(event) {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const name = formData.get("name").trim();
  const email = normalizeEmail(formData.get("email"));
  const password = formData.get("password");

  if (!name || !email || password.length < 6) {
    setAuthMessage("Please enter a name, email, and password of at least 6 characters.", "error");
    return;
  }

  const existingUser = await getUser(email);
  if (existingUser) {
    setAuthMessage("An account with this email already exists. Try logging in.", "error");
    return;
  }

  const salt = createSalt();
  const user = {
    name,
    email,
    salt,
    passwordHash: await hashPassword(password, salt),
    completedActivities: 0,
    examCompletedDrills: state.completedDrills,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveUser(user);
  signupForm.reset();
  await setActiveUser(user);
  setAuthMessage("Account created. Test modules are unlocked.", "success");
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = normalizeEmail(formData.get("email"));
  const password = formData.get("password");
  const user = await getUser(email);

  if (!user) {
    setAuthMessage("No account found for that email.", "error");
    return;
  }

  const passwordHash = await hashPassword(password, user.salt);
  if (passwordHash !== user.passwordHash) {
    setAuthMessage("That password does not match.", "error");
    return;
  }

  loginForm.reset();
  await setActiveUser(user);
  setAuthMessage("Logged in. Test modules are unlocked.", "success");
}

async function handleLogout() {
  if (state.activeUser) {
    state.activeUser.examCompletedDrills = state.completedDrills;
    await saveUser(state.activeUser);
  }

  state.activeUser = null;
  state.isLoggedIn = false;
  state.completedDrills = 0;
  localStorage.removeItem(SESSION_KEY);
  renderDrill();
  setAuthMessage("Logged out. Sign in again to use test modules.", "success");
}

function renderExamCards() {
  examGrid.innerHTML = Object.entries(examPractice)
    .map(
      ([examKey, exam]) => `
        <article class="test-path-card ${examKey === state.currentExamKey ? "active" : ""}">
          <div class="test-card-top">
            <span class="exam-code">${exam.name}</span>
            <span class="exam-level">${exam.level}</span>
          </div>
          <h3>${exam.title}</h3>
          <p>${exam.description}</p>
          <div class="test-card-meta">
            <span>${exam.duration}</span>
            <span>${exam.skills.length} skills</span>
          </div>
          <ul>
            ${exam.skills.map((skill) => `<li>${skill}</li>`).join("")}
          </ul>
          <button
            class="button ${examKey === state.currentExamKey ? "primary" : "secondary"} test-select"
            type="button"
            data-exam="${examKey}"
            ${state.isLoggedIn ? "" : "disabled"}
          >
            ${state.isLoggedIn ? (examKey === state.currentExamKey ? "Selected" : `Choose ${exam.name}`) : "Login required"}
          </button>
        </article>
      `
    )
    .join("");
}

function renderSkillButtons() {
  const exam = getCurrentExam();
  skillButtons.innerHTML = exam.drills
    .map(
      (drill, index) => `
        <button
          class="skill-button ${index === state.currentDrillIndex ? "active" : ""}"
          type="button"
          data-drill="${index}"
          ${state.isLoggedIn ? "" : "disabled"}
        >
          ${drill.skill}
        </button>
      `
    )
    .join("");
}

function renderDrill() {
  const exam = getCurrentExam();
  const drill = getCurrentDrill();
  drillTitle.textContent = `${exam.name} ${drill.skill} drill`;
  drillSkill.textContent = drill.skill;
  drillPrompt.textContent = drill.prompt;
  drillTask.textContent = drill.task;
  drillResponse.value = "";
  drillFeedback.textContent = state.isLoggedIn
    ? ""
    : "Login or sign up to answer this prompt and view model answers.";
  drillFeedback.className = "quiz-feedback";
  state.currentDrillCompleted = false;
  renderExamCards();
  renderSkillButtons();
  updateStats();
  updateAuthGate();
}

function selectExam(examKey) {
  if (!state.isLoggedIn) {
    showLoginRequiredMessage();
    return;
  }

  state.currentExamKey = examKey;
  state.currentDrillIndex = 0;
  renderDrill();
}

function completeDrill() {
  if (!state.isLoggedIn) {
    showLoginRequiredMessage();
    return;
  }

  const response = drillResponse.value.trim();
  const drill = getCurrentDrill();

  if (response.length < 10) {
    drillFeedback.textContent = "Write at least one full sentence before checking the model answer.";
    drillFeedback.className = "quiz-feedback incorrect";
    return;
  }

  if (!state.currentDrillCompleted) {
    state.completedDrills += 1;
    state.currentDrillCompleted = true;
  }
  drillFeedback.innerHTML = `
    <strong>Model answer:</strong> ${drill.answer}<br>
    <strong>Strategy:</strong> ${drill.strategy}
  `;
  drillFeedback.className = "quiz-feedback correct";
  updateStats();
}

function showNextDrill() {
  if (!state.isLoggedIn) {
    showLoginRequiredMessage();
    return;
  }

  const drills = getCurrentExam().drills;
  state.currentDrillIndex = (state.currentDrillIndex + 1) % drills.length;
  renderDrill();
}

function showLoginRequiredMessage() {
  drillFeedback.textContent = "Please log in or sign up before using test modules.";
  drillFeedback.className = "quiz-feedback incorrect";
  document.querySelector("#test-access").scrollIntoView({ behavior: "smooth", block: "center" });
}

examGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".test-select");
  if (!button) {
    return;
  }

  selectExam(button.dataset.exam);
});

skillButtons.addEventListener("click", (event) => {
  const button = event.target.closest(".skill-button");
  if (!button) {
    return;
  }

  if (!state.isLoggedIn) {
    showLoginRequiredMessage();
    return;
  }

  state.currentDrillIndex = Number(button.dataset.drill);
  renderDrill();
});

checkButton.addEventListener("click", completeDrill);
nextButton.addEventListener("click", showNextDrill);
loginForm.addEventListener("submit", (event) => {
  handleLogin(event).catch(() => {
    setAuthMessage("Login failed. Please try again.", "error");
  });
});
signupForm.addEventListener("submit", (event) => {
  handleSignup(event).catch(() => {
    setAuthMessage("Account creation failed. Please try again.", "error");
  });
});
logoutButton.addEventListener("click", () => {
  handleLogout().catch(() => {
    setAuthMessage("Logout failed. Please try again.", "error");
  });
});

async function initializeTestsPage() {
  renderDrill();

  if (!("indexedDB" in window) || !("crypto" in window) || !crypto.subtle) {
    setAuthMessage("Accounts need a browser with IndexedDB and secure crypto support.", "error");
    return;
  }

  try {
    db = await openDatabase();
    await restoreSession();
  } catch (error) {
    setAuthMessage("The browser database could not be opened.", "error");
  }
}

initializeTestsPage();
