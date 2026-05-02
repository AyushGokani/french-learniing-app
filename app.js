const lessons = [
  {
    title: "Greetings",
    description: "Say hello, goodbye, and ask how someone is doing.",
    phrases: [
      { french: "Bonjour", english: "Hello" },
      { french: "Bonsoir", english: "Good evening" },
      { french: "Comment ça va ?", english: "How are you?" },
    ],
  },
  {
    title: "Polite basics",
    description: "Use courteous phrases that make every conversation smoother.",
    phrases: [
      { french: "S'il vous plaît", english: "Please" },
      { french: "Merci beaucoup", english: "Thank you very much" },
      { french: "Excusez-moi", english: "Excuse me" },
    ],
  },
  {
    title: "Cafe phrases",
    description: "Order confidently when you visit a cafe or bakery.",
    phrases: [
      { french: "Je voudrais un café", english: "I would like a coffee" },
      { french: "L'addition, s'il vous plaît", english: "The check, please" },
      { french: "C'est délicieux", english: "It is delicious" },
    ],
  },
];

const vocabulary = [
  { french: "Bonjour", english: "Hello", category: "Greetings" },
  { french: "Au revoir", english: "Goodbye", category: "Greetings" },
  { french: "Merci", english: "Thank you", category: "Polite basics" },
  { french: "Oui", english: "Yes", category: "Essentials" },
  { french: "Non", english: "No", category: "Essentials" },
  { french: "Pain", english: "Bread", category: "Food" },
  { french: "Eau", english: "Water", category: "Food" },
  { french: "Fromage", english: "Cheese", category: "Food" },
];

const quizQuestions = [
  {
    prompt: "What does “Merci beaucoup” mean?",
    answer: "Thank you very much",
    options: ["Good morning", "Thank you very much", "See you soon", "I am sorry"],
  },
  {
    prompt: "What does “L'addition, s'il vous plaît” mean?",
    answer: "The check, please",
    options: ["The check, please", "A glass of water", "Where is the train?", "I speak French"],
  },
  {
    prompt: "What does “Comment ça va ?” mean?",
    answer: "How are you?",
    options: ["What is your name?", "How are you?", "Where do you live?", "How much is it?"],
  },
];

const DB_NAME = "bonjourBuddyDb";
const DB_VERSION = 1;
const USER_STORE = "users";
const SESSION_KEY = "bonjourBuddySession";
const GUEST_PROGRESS_KEY = "completedActivities";
let db;

const state = {
  activeUser: null,
  completedActivities: Number(localStorage.getItem(GUEST_PROGRESS_KEY)) || 0,
  currentCardIndex: 0,
  currentQuestionIndex: 0,
  currentQuestionAnswered: false,
};

const lessonGrid = document.querySelector("#lesson-grid");
const completedCount = document.querySelector("#completed-count");
const progressBar = document.querySelector("#progress-bar");
const progressMessage = document.querySelector("#progress-message");
const cardCategory = document.querySelector("#card-category");
const frenchWord = document.querySelector("#french-word");
const englishWord = document.querySelector("#english-word");
const nextCardButton = document.querySelector("#next-card-button");
const speakButton = document.querySelector("#speak-button");
const quizForm = document.querySelector("#quiz-form");
const quizQuestion = document.querySelector("#quiz-question");
const quizOptions = document.querySelector("#quiz-options");
const quizFeedback = document.querySelector("#quiz-feedback");
const nextQuestionButton = document.querySelector("#next-question-button");
const accountCta = document.querySelector("#account-cta");
const sessionBadge = document.querySelector("#session-badge");
const showLoginButton = document.querySelector("#show-login");
const showSignupButton = document.querySelector("#show-signup");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const authMessage = document.querySelector("#auth-message");
const profileTitle = document.querySelector("#profile-title");
const profileCopy = document.querySelector("#profile-copy");
const profileEmail = document.querySelector("#profile-email");
const userCount = document.querySelector("#user-count");
const logoutButton = document.querySelector("#logout-button");

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

function countUsers() {
  const transaction = db.transaction(USER_STORE, "readonly");
  const store = transaction.objectStore(USER_STORE);

  return requestToPromise(store.count());
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

function saveSession(email) {
  localStorage.setItem(SESSION_KEY, email);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function persistActiveUserProgress() {
  if (!state.activeUser) {
    localStorage.setItem(GUEST_PROGRESS_KEY, String(state.completedActivities));
    return;
  }

  state.activeUser.completedActivities = state.completedActivities;
  state.activeUser.updatedAt = new Date().toISOString();
  if (window.BonjourApi?.isServerUser(state.activeUser)) {
    await window.BonjourApi.saveProgress({
      completedActivities: state.completedActivities,
      activityType: "general_practice",
    });
    return;
  }

  await saveUser(state.activeUser);
}

function renderLessons() {
  lessonGrid.innerHTML = lessons
    .map(
      (lesson, lessonIndex) => `
        <article class="lesson-card">
          <div>
            <span class="card-label">Lesson ${lessonIndex + 1}</span>
            <h3>${lesson.title}</h3>
            <p>${lesson.description}</p>
          </div>
          <ul>
            ${lesson.phrases
              .map((phrase) => `<li><strong>${phrase.french}</strong><span>${phrase.english}</span></li>`)
              .join("")}
          </ul>
          <button class="button secondary lesson-complete" type="button" data-lesson="${lessonIndex}">
            Mark complete
          </button>
        </article>
      `
    )
    .join("");
}

function updateProgress() {
  const cappedCount = Math.min(state.completedActivities, 10);
  const progressPercent = (cappedCount / 10) * 100;
  completedCount.textContent = String(state.completedActivities);
  progressBar.style.width = `${progressPercent}%`;
  progressMessage.textContent =
    state.completedActivities >= 10
      ? "Excellent work. You reached today's practice goal!"
      : `${10 - cappedCount} more activities to reach today's goal.`;
}

function addProgress() {
  state.completedActivities += 1;
  updateProgress();
  persistActiveUserProgress().catch(() => {
    setAuthMessage("Progress could not be saved right now.", "error");
  });
}

function switchAuthPanel(panel) {
  const isLogin = panel === "login";
  showLoginButton.classList.toggle("active", isLogin);
  showSignupButton.classList.toggle("active", !isLogin);
  showLoginButton.setAttribute("aria-selected", String(isLogin));
  showSignupButton.setAttribute("aria-selected", String(!isLogin));
  loginForm.classList.toggle("active", isLogin);
  signupForm.classList.toggle("active", !isLogin);
  setAuthMessage("");
}

async function renderProfile() {
  const storedUsers = await countUsers();
  userCount.textContent = window.BonjourApi?.isServerUser(state.activeUser)
    ? "Server DB"
    : String(storedUsers);

  if (!state.activeUser) {
    sessionBadge.textContent = "Guest mode";
    accountCta.textContent = "Create account";
    profileTitle.textContent = "No one is logged in yet";
    profileCopy.textContent =
      "Create an account to save your profile and track progress separately from guest practice.";
    profileEmail.textContent = "Guest";
    logoutButton.classList.add("hidden");
    return;
  }

  sessionBadge.textContent = `Logged in as ${state.activeUser.name}`;
  accountCta.textContent = "View account";
  profileTitle.textContent = `Bonjour, ${state.activeUser.name}`;
  profileCopy.textContent =
    window.BonjourApi?.isServerUser(state.activeUser)
      ? "Your learner profile and activity progress are saved in the central database."
      : "Your learner profile and activity progress are saved in this browser database.";
  profileEmail.textContent = state.activeUser.email;
  logoutButton.classList.remove("hidden");
}

async function setActiveUser(user) {
  state.activeUser = user;
  state.completedActivities = Number(user.completedActivities) || 0;
  if (!window.BonjourApi?.isServerUser(user)) {
    saveSession(user.email);
  }
  updateProgress();
  await renderProfile();
}

async function restoreSession() {
  if (window.BonjourApi) {
    const serverSession = await window.BonjourApi.getCurrentUser();
    if (serverSession.user) {
      await setActiveUser(serverSession.user);
      return;
    }
  }

  const sessionEmail = localStorage.getItem(SESSION_KEY);

  if (!sessionEmail) {
    await renderProfile();
    return;
  }

  const user = await getUser(sessionEmail);
  if (!user) {
    clearSession();
    await renderProfile();
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
    switchAuthPanel("login");
    return;
  }

  if (window.BonjourApi) {
    const serverSignup = await window.BonjourApi.signup({ name, email, password });
    if (serverSignup.user) {
      clearSession();
      signupForm.reset();
      await setActiveUser(serverSignup.user);
      setAuthMessage("Account created in the central database. Bienvenue!", "success");
      return;
    }

    if (!serverSignup.isUnavailable) {
      setAuthMessage(serverSignup.error || "Account creation failed. Please try again.", "error");
      return;
    }
  }

  const salt = createSalt();
  const user = {
    name,
    email,
    salt,
    passwordHash: await hashPassword(password, salt),
    completedActivities: state.completedActivities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveUser(user);
  signupForm.reset();
  await setActiveUser(user);
  setAuthMessage("Account created and logged in. Bienvenue!", "success");
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = normalizeEmail(formData.get("email"));
  const password = formData.get("password");

  if (window.BonjourApi) {
    const serverLogin = await window.BonjourApi.login({ email, password });
    if (serverLogin.user) {
      clearSession();
      loginForm.reset();
      await setActiveUser(serverLogin.user);
      setAuthMessage("Logged in with the central database. Bon retour!", "success");
      return;
    }

    if (!serverLogin.isUnavailable) {
      setAuthMessage(serverLogin.error || "Login failed. Please try again.", "error");
      return;
    }
  }

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
  setAuthMessage("Logged in successfully. Bon retour!", "success");
}

async function handleLogout() {
  await persistActiveUserProgress();
  if (window.BonjourApi?.isServerUser(state.activeUser)) {
    await window.BonjourApi.logout();
  }
  state.activeUser = null;
  state.completedActivities = Number(localStorage.getItem(GUEST_PROGRESS_KEY)) || 0;
  clearSession();
  updateProgress();
  await renderProfile();
  setAuthMessage("Logged out. You are back in guest mode.", "success");
}

function renderFlashcard() {
  const card = vocabulary[state.currentCardIndex];
  cardCategory.textContent = card.category;
  frenchWord.textContent = card.french;
  englishWord.textContent = card.english;
}

function renderQuizQuestion() {
  const question = quizQuestions[state.currentQuestionIndex];
  quizQuestion.textContent = question.prompt;
  quizOptions.innerHTML = question.options
    .map(
      (option, optionIndex) => `
        <label class="quiz-option">
          <input type="radio" name="answer" value="${option}" ${optionIndex === 0 ? "required" : ""}>
          <span>${option}</span>
        </label>
      `
    )
    .join("");
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";
  state.currentQuestionAnswered = false;
}

function speakCurrentCard() {
  if (!("speechSynthesis" in window)) {
    quizFeedback.textContent = "Speech is not supported in this browser yet.";
    return;
  }

  const utterance = new SpeechSynthesisUtterance(vocabulary[state.currentCardIndex].french);
  utterance.lang = "fr-FR";
  window.speechSynthesis.speak(utterance);
}

lessonGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".lesson-complete");
  if (!button) {
    return;
  }

  button.textContent = "Completed";
  button.disabled = true;
  button.closest(".lesson-card").classList.add("completed");
  addProgress();
});

nextCardButton.addEventListener("click", () => {
  state.currentCardIndex = (state.currentCardIndex + 1) % vocabulary.length;
  renderFlashcard();
  addProgress();
});

speakButton.addEventListener("click", speakCurrentCard);

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedAnswer = new FormData(quizForm).get("answer");
  const question = quizQuestions[state.currentQuestionIndex];

  if (selectedAnswer === question.answer) {
    quizFeedback.textContent = "Correct! Très bien.";
    quizFeedback.className = "quiz-feedback correct";
    if (!state.currentQuestionAnswered) {
      addProgress();
      state.currentQuestionAnswered = true;
    }
  } else {
    quizFeedback.textContent = `Not quite. The correct answer is "${question.answer}."`;
    quizFeedback.className = "quiz-feedback incorrect";
  }
});

nextQuestionButton.addEventListener("click", () => {
  state.currentQuestionIndex = (state.currentQuestionIndex + 1) % quizQuestions.length;
  renderQuizQuestion();
});

showLoginButton.addEventListener("click", () => switchAuthPanel("login"));

showSignupButton.addEventListener("click", () => switchAuthPanel("signup"));

signupForm.addEventListener("submit", (event) => {
  handleSignup(event).catch(() => {
    setAuthMessage("Account creation failed. Please try again.", "error");
  });
});

loginForm.addEventListener("submit", (event) => {
  handleLogin(event).catch(() => {
    setAuthMessage("Login failed. Please try again.", "error");
  });
});

logoutButton.addEventListener("click", () => {
  handleLogout().catch(() => {
    setAuthMessage("Logout failed. Please try again.", "error");
  });
});

async function initializeApp() {
  renderLessons();
  renderFlashcard();
  renderQuizQuestion();
  updateProgress();

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

initializeApp();
