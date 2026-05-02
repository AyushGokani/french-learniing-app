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

const examPractice = {
  TEF: {
    name: "TEF",
    title: "Test d'Evaluation de Francais",
    description: "Immigration, citizenship, work, and academic French practice.",
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
    ],
  },
  TCF: {
    name: "TCF",
    title: "Test de connaissance du francais",
    description: "Placement, immigration, and general language certification practice.",
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
    ],
  },
  DELF: {
    name: "DELF",
    title: "Diplome d'etudes en langue francaise",
    description: "Official CEFR diploma practice from A1 to B2.",
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
    ],
  },
};

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
  currentExamKey: "TEF",
  currentExamDrillIndex: 0,
  currentExamAnswered: false,
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
const examGrid = document.querySelector("#exam-grid");
const examDrillTitle = document.querySelector("#exam-practice-title");
const examDrillSkill = document.querySelector("#exam-skill-label");
const examDrillPrompt = document.querySelector("#exam-practice-prompt");
const examDrillTask = document.querySelector("#exam-task-text");
const examSkillButtons = document.querySelector("#exam-skill-buttons");
const examAnswer = document.querySelector("#exam-response");
const checkExamButton = document.querySelector("#complete-exam-task");
const nextExamButton = document.querySelector("#next-exam-task");
const examFeedback = document.querySelector("#exam-feedback");
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
  userCount.textContent = String(storedUsers);

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
    "Your learner profile and activity progress are saved in this browser database.";
  profileEmail.textContent = state.activeUser.email;
  logoutButton.classList.remove("hidden");
}

async function setActiveUser(user) {
  state.activeUser = user;
  state.completedActivities = Number(user.completedActivities) || 0;
  saveSession(user.email);
  updateProgress();
  await renderProfile();
}

async function restoreSession() {
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

function getCurrentExamDrill() {
  return examPractice[state.currentExamKey].drills[state.currentExamDrillIndex];
}

function renderExamCards() {
  examGrid.innerHTML = Object.entries(examPractice)
    .map(
      ([examKey, exam]) => `
        <article class="exam-card ${examKey === state.currentExamKey ? "active" : ""}">
          <span class="card-label">${exam.name}</span>
          <h3>${exam.title}</h3>
          <p>${exam.description}</p>
          <ul>
            ${exam.skills.map((skill) => `<li>${skill}</li>`).join("")}
          </ul>
          <button class="button secondary exam-select" type="button" data-exam="${examKey}">
            Practice ${exam.name}
          </button>
        </article>
      `
    )
    .join("");
}

function renderExamSkillButtons() {
  const exam = examPractice[state.currentExamKey];

  examSkillButtons.innerHTML = exam.drills
    .map(
      (drill, drillIndex) => `
        <button
          class="skill-button ${drillIndex === state.currentExamDrillIndex ? "active" : ""}"
          type="button"
          data-drill="${drillIndex}"
        >
          ${drill.skill}
        </button>
      `
    )
    .join("");
}

function renderExamDrill() {
  const exam = examPractice[state.currentExamKey];
  const drill = getCurrentExamDrill();
  examDrillTitle.textContent = `${exam.name} practice`;
  examDrillSkill.textContent = drill.skill;
  examDrillPrompt.textContent = drill.prompt;
  examDrillTask.textContent = drill.task;
  examAnswer.value = "";
  examFeedback.textContent = "";
  examFeedback.className = "exam-feedback";
  state.currentExamAnswered = false;
  renderExamSkillButtons();
}

function selectExam(examKey) {
  state.currentExamKey = examKey;
  state.currentExamDrillIndex = 0;
  renderExamCards();
  renderExamDrill();
  document.querySelector(".exam-practice-card").scrollIntoView({ behavior: "smooth", block: "center" });
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

examGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".exam-select");
  if (!button) {
    return;
  }

  selectExam(button.dataset.exam);
});

checkExamButton.addEventListener("click", () => {
  const drill = getCurrentExamDrill();
  const userResponse = examAnswer.value.trim();

  if (userResponse.length < 10) {
    examFeedback.textContent = "Write at least one full sentence before checking the model answer.";
    examFeedback.className = "exam-feedback incorrect";
    return;
  }

  examFeedback.innerHTML = `
    <strong>Model answer:</strong> ${drill.answer}<br>
    <strong>Strategy:</strong> ${drill.strategy}
  `;
  examFeedback.className = "exam-feedback correct";

  if (!state.currentExamAnswered) {
    addProgress();
    state.currentExamAnswered = true;
  }
});

nextExamButton.addEventListener("click", () => {
  const drills = examPractice[state.currentExamKey].drills;
  state.currentExamDrillIndex = (state.currentExamDrillIndex + 1) % drills.length;
  renderExamDrill();
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
  renderExamCards();
  renderExamDrill();
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
