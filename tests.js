const examPractice = {
  TEF: {
    name: "TEF",
    title: "Test d'Evaluation de Francais",
    description: "Official-style modules for immigration, citizenship, work, and academic French.",
    level: "A2-C1",
    duration: "Timed section practice",
    modules: [
      {
        section: "Listening",
        title: "Comprehension orale",
        duration: "About 40 min",
        format: "Audio situations and multiple-choice comprehension",
        instructions: "Listen for who, where, why, dates, numbers, and speaker intention.",
        tasks: [
          {
            prompt: "You hear: \"Le train pour Lyon partira avec dix minutes de retard.\" What changed?",
            audioText: "Le train pour Lyon partira avec dix minutes de retard.",
            task: "Answer with the key information from the announcement.",
            answer: "The train to Lyon will leave ten minutes late.",
            strategy: "Listen for time expressions, destination names, and delay words like retard.",
          },
          {
            prompt: "A voicemail says: \"Votre rendez-vous est confirme mardi a 14h30 au bureau 3.\"",
            audioText: "Votre rendez-vous est confirme mardi a quatorze heures trente au bureau trois.",
            task: "Write the appointment day, time, and location.",
            answer: "The appointment is Tuesday at 14:30 in office 3.",
            strategy: "TEF audio often hides the answer in practical details: date, time, and place.",
          },
        ],
      },
      {
        section: "Reading",
        title: "Comprehension ecrite",
        duration: "About 60 min",
        format: "Notices, messages, short articles, and inference questions",
        instructions: "Read quickly first, then scan for keywords, deadlines, and purpose.",
        tasks: [
          {
            prompt: "A TEF notice says: \"Les inscriptions ferment vendredi a midi.\" What is the deadline?",
            task: "Identify the action and exact time limit in one sentence.",
            answer: "Registrations close on Friday at noon.",
            strategy: "For TEF reading, scan first for dates, times, verbs of action, and deadlines.",
          },
          {
            prompt: "Email: \"Merci de joindre une copie de votre passeport avant l'entretien.\"",
            task: "Explain what document is requested and when it is needed.",
            answer: "A copy of the passport is requested before the interview.",
            strategy: "Notice obligation words such as merci de, veuillez, obligatoire, and avant.",
          },
        ],
      },
      {
        section: "Writing",
        title: "Expression ecrite",
        duration: "About 60 min",
        format: "Short message plus opinion/argument writing",
        instructions: "Answer the full task, organize ideas, and use connectors.",
        tasks: [
          {
            prompt: "Write a short message to a school asking for information about evening French classes.",
            task: "Include your goal, availability, and one question about price or schedule.",
            answer: "Bonjour, je souhaite suivre des cours de francais le soir. Je suis disponible apres 18h. Pourriez-vous m'envoyer les horaires et les tarifs ? Merci.",
            strategy: "For TEF writing, cover every requested point before trying advanced grammar.",
          },
          {
            prompt: "Should people learn French before moving to Canada?",
            task: "Write 3-4 sentences with an opinion, reason, example, and conclusion.",
            answer:
              "Use opinion + reason + example + conclusion: A mon avis..., parce que..., par exemple..., donc...",
            strategy: "TEF writing rewards structure, connectors, and clear everyday arguments.",
          },
        ],
      },
      {
        section: "Speaking",
        title: "Expression orale",
        duration: "About 15 min",
        format: "Information exchange and persuasive role-play",
        instructions: "Speak clearly, ask questions, react naturally, and defend your opinion.",
        tasks: [
          {
            prompt: "Call a language school to ask about course dates, levels, prices, and registration.",
            task: "Prepare questions you would ask the receptionist.",
            answer: "Ask about start date, level test, class times, price, documents, and registration deadline.",
            strategy: "In the information task, ask complete questions and confirm the answers.",
          },
          {
            prompt: "Convince a colleague to join a French conversation club after work.",
            task: "Prepare a persuasive 45-second speaking outline.",
            answer: "Start with the benefit, add one practical detail, then invite them directly.",
            strategy: "For TEF speaking, organize persuasion with problem, benefit, example, action.",
          },
        ],
      },
    ],
  },
  TCF: {
    name: "TCF",
    title: "Test de connaissance du francais",
    description: "Official-style compulsory and optional module practice.",
    level: "A1-C2",
    duration: "Compulsory + optional modules",
    modules: [
      {
        section: "Listening",
        title: "Comprehension orale",
        duration: "About 25 min",
        format: "Audio clips from everyday, academic, and professional contexts",
        instructions: "Identify the situation, speaker intention, key details, and implied meaning.",
        tasks: [
          {
            prompt: "You hear a voicemail asking you to call back before 18h.",
            audioText: "Bonjour, merci de me rappeler avant dix-huit heures aujourd'hui.",
            task: "Write the action and deadline.",
            answer: "You need to call back before 6 p.m.",
            strategy: "TCF audio often tests action + time + person. Capture those three details.",
          },
          {
            prompt: "A speaker says the meeting is moved from room 204 to room 312.",
            audioText: "La reunion ne sera pas en salle deux cent quatre. Elle est deplacee en salle trois cent douze.",
            task: "What information changed?",
            answer: "The meeting room changed from 204 to 312.",
            strategy: "Listen for correction markers such as finalement, plutot, or changement.",
          },
        ],
      },
      {
        section: "Language structures",
        title: "Maitrise des structures de la langue",
        duration: "About 15 min",
        format: "Grammar, vocabulary, connectors, and sentence completion",
        instructions: "Choose the grammatically correct option in context.",
        tasks: [
          {
            prompt: "Choose the correct sentence: \"Je vais ___ boulangerie.\"",
            task: "Type the missing words and explain why.",
            answer: "a la - Je vais a la boulangerie.",
            strategy: "Review contractions and prepositions: a la, au, aux, de la, du, des.",
          },
          {
            prompt: "Complete: \"Si j'avais le temps, je ___ plus souvent.\"",
            task: "Choose the correct verb form and explain the tense.",
            answer: "lirais - Si + imparfait uses conditionnel in the result clause.",
            strategy: "TCF structures often test tense agreement and common conditional patterns.",
          },
        ],
      },
      {
        section: "Reading",
        title: "Comprehension ecrite",
        duration: "About 45 min",
        format: "Notices, correspondence, articles, and opinion texts",
        instructions: "Find explicit information first, then infer tone and purpose.",
        tasks: [
          {
            prompt: "A notice says: \"Fermeture exceptionnelle ce lundi.\" What does it mean?",
            task: "Explain the notice in one sentence.",
            answer: "The place is exceptionally closed this Monday.",
            strategy: "For TCF notices, identify the action first: opening, closing, delay, or cancellation.",
          },
          {
            prompt: "A job ad asks for someone \"disponible immediatement et capable de travailler en equipe.\"",
            task: "Name two requirements from the advertisement.",
            answer: "The candidate must be available immediately and able to work in a team.",
            strategy: "In TCF reading, underline requirement words like doit, capable de, exige, and disponible.",
          },
        ],
      },
      {
        section: "Speaking",
        title: "Expression orale",
        duration: "About 12 min",
        format: "Interview, interaction, and opinion task",
        instructions: "Answer directly, expand with reasons, and maintain interaction.",
        tasks: [
          {
            prompt: "Introduce yourself to the examiner and explain why you are learning French.",
            task: "Prepare a 60-second answer.",
            answer: "Give identity, work/study, current level, goal, and one concrete reason.",
            strategy: "TCF speaking rewards complete answers, natural pace, and clear examples.",
          },
          {
            prompt: "Give your opinion: Is remote work good for employees?",
            task: "State your opinion and give two reasons.",
            answer: "Use structure: opinion, first reason, second reason, short conclusion.",
            strategy: "Use connectors such as d'abord, ensuite, cependant, and donc.",
          },
        ],
      },
    ],
  },
  DELF: {
    name: "DELF",
    title: "Diplome d'etudes en langue francaise",
    description: "CEFR diploma modules modeled around the four DELF sections.",
    level: "A1-B2",
    duration: "Four scored sections",
    modules: [
      {
        section: "Listening",
        title: "Comprehension de l'oral",
        duration: "Varies by level",
        format: "Short recordings, announcements, dialogues, interviews",
        instructions: "Listen for the general situation first, then answer detail questions.",
        tasks: [
          {
            prompt: "You hear a museum announcement: entry is free for students on Wednesday.",
            audioText: "L'entree du musee est gratuite pour les etudiants mercredi.",
            task: "Identify who gets free entry and when.",
            answer: "Students get free entry on Wednesday.",
            strategy: "DELF listening often asks for public, place, price, time, or reason.",
          },
          {
            prompt: "A friend says she cannot come because she has a doctor's appointment.",
            audioText: "Je suis desolee, je ne peux pas venir parce que j'ai rendez-vous chez le medecin.",
            task: "Explain why she cannot come.",
            answer: "She cannot come because she has a doctor's appointment.",
            strategy: "For lower DELF levels, focus on direct reasons introduced by parce que.",
          },
        ],
      },
      {
        section: "Reading",
        title: "Comprehension des ecrits",
        duration: "Varies by level",
        format: "Posters, emails, articles, and practical documents",
        instructions: "Find who, what, where, when, why, then answer in your own words.",
        tasks: [
          {
            prompt: "A poster advertises a free concert in the park on Sunday afternoon.",
            task: "Identify who can attend, where it is, and when it happens.",
            answer: "Anyone can attend a free concert in the park on Sunday afternoon.",
            strategy: "For DELF reading, scan for public, place, time, price, and purpose.",
          },
          {
            prompt: "An email says: \"N'oublie pas d'apporter ton maillot de bain pour la sortie.\"",
            task: "What should the person bring?",
            answer: "They should bring a swimsuit.",
            strategy: "Watch for practical instruction verbs: apporter, envoyer, remplir, choisir.",
          },
        ],
      },
      {
        section: "Writing",
        title: "Production ecrite",
        duration: "Varies by level",
        format: "Message, email, story, opinion, or formal letter depending on level",
        instructions: "Respect the situation, include all required points, and organize your text.",
        tasks: [
          {
            prompt: "Write a short email inviting a friend to your birthday dinner.",
            task: "Include greeting, invitation, date/time/place, one detail, and a closing.",
            answer: "Bonjour..., je t'invite..., samedi a 19h..., chez moi..., a bientot.",
            strategy: "DELF writing tasks often grade task completion as much as grammar.",
          },
          {
            prompt: "You attended a cultural event. Write a short review for your class.",
            task: "Mention the event, what you liked, and one recommendation.",
            answer: "Use past tense for what happened, opinion phrases for reaction, and a final recommendation.",
            strategy: "For B1/B2-style writing, structure paragraphs and justify opinions.",
          },
        ],
      },
      {
        section: "Speaking",
        title: "Production orale",
        duration: "Varies by level",
        format: "Guided interview, role-play, and opinion presentation",
        instructions: "Answer naturally, ask questions in role-play, and defend opinions with examples.",
        tasks: [
          {
            prompt: "Introduce yourself for a DELF A2 speaking task: name, city, work/studies, hobbies.",
            task: "Say or type a natural answer you could give to an examiner.",
            answer: "Bonjour, je m'appelle..., j'habite a..., je travaille/etudie..., et j'aime...",
            strategy: "Prepare reusable introductions, then adapt them naturally to the examiner's question.",
          },
          {
            prompt: "Role-play: You want to return a product to a shop because it does not work.",
            task: "Prepare what you would say and two questions you would ask.",
            answer: "Explain the problem, request an exchange or refund, ask about the receipt and deadline.",
            strategy: "In DELF role-play, keep the interaction alive with polite questions.",
          },
        ],
      },
    ],
  },
};

window.BONJOUR_EXAM_PRACTICE = examPractice;

const DB_NAME = "bonjourBuddyDb";
const DB_VERSION = 1;
const USER_STORE = "users";
const SESSION_KEY = "bonjourBuddySession";
let db;

const state = {
  activeUser: null,
  currentExamKey: "TEF",
  currentModuleIndex: 0,
  currentTaskIndex: 0,
  selectedLevel: "B2",
  completedTasks: 0,
  currentTaskCompleted: false,
  isLoggedIn: false,
};

const examGrid = document.querySelector("#test-path-grid");
const levelSelect = document.querySelector("#test-level");
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

function getCurrentModule() {
  return getCurrentExam().modules[state.currentModuleIndex];
}

function getCurrentTask() {
  return getCurrentModule().tasks[state.currentTaskIndex];
}

function updateStats() {
  const task = getCurrentTask();
  completedCount.textContent = String(state.completedTasks);
  activeExam.textContent = state.currentExamKey;
  drillSkill.textContent = task.skill;
  if (state.activeUser && !window.BonjourApi?.isServerUser(state.activeUser)) {
    state.activeUser.examCompletedDrills = state.completedTasks;
    saveUser(state.activeUser).catch(() => {
      setAuthMessage("Exam progress could not be saved right now.", "error");
    });
  }
}

function updateAuthGate() {
  const locked = !state.isLoggedIn;
  accessTitle.textContent = locked ? "Sign in to unlock test modules" : "Test modules unlocked";
  accessCopy.textContent = locked
    ? "Test modules, model answers, and exam progress are available after login so your practice can be saved to your learner profile."
    : "You are signed in. Choose an exam path and complete module tasks to build your exam readiness.";
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
  state.completedTasks = Number(user.examCompletedDrills) || 0;
  if (!window.BonjourApi?.isServerUser(user)) {
    localStorage.setItem(SESSION_KEY, user.email);
  }
  setAuthMessage("");
  state.currentModuleIndex = 0;
  state.currentTaskIndex = 0;
  renderDrill();
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

  if (window.BonjourApi) {
    const serverSignup = await window.BonjourApi.signup({ name, email, password });
    if (serverSignup.user) {
      localStorage.removeItem(SESSION_KEY);
      signupForm.reset();
      await setActiveUser(serverSignup.user);
      setAuthMessage("Account created in the central database. Test modules are unlocked.", "success");
      return;
    }

    if (!serverSignup.isUnavailable) {
      setAuthMessage(serverSignup.error || "Account creation failed. Please try again.", "error");
      return;
    }
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
    examCompletedDrills: state.completedTasks,
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

  if (window.BonjourApi) {
    const serverLogin = await window.BonjourApi.login({ email, password });
    if (serverLogin.user) {
      localStorage.removeItem(SESSION_KEY);
      loginForm.reset();
      await setActiveUser(serverLogin.user);
      setAuthMessage("Logged in with the central database. Test modules are unlocked.", "success");
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
  setAuthMessage("Logged in. Test modules are unlocked.", "success");
}

async function handleLogout() {
  if (state.activeUser) {
    state.activeUser.examCompletedDrills = state.completedTasks;
    if (window.BonjourApi?.isServerUser(state.activeUser)) {
      await window.BonjourApi.logout();
    } else {
      await saveUser(state.activeUser);
    }
  }

  state.activeUser = null;
  state.isLoggedIn = false;
  state.completedTasks = 0;
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
            <span>${exam.modules.length} sections</span>
          </div>
          <ul>
            ${exam.modules
              .map(
                (module, moduleIndex) => `
                  <li>
                    <a href="section.html?exam=${examKey}&module=${moduleIndex}&level=${state.selectedLevel}">
                      ${module.title}
                    </a>
                  </li>
                `
              )
              .join("")}
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
  skillButtons.innerHTML = exam.modules
    .map(
      (module, index) => `
        <button
          class="skill-button ${index === state.currentModuleIndex ? "active" : ""}"
          type="button"
          data-module="${index}"
          ${state.isLoggedIn ? "" : "disabled"}
        >
          <strong>${module.title}</strong>
          <span>${module.duration} - ${module.format}</span>
        </button>
      `
    )
    .join("");
}

function renderDrill() {
  const exam = getCurrentExam();
  const module = getCurrentModule();
  const task = getCurrentTask();
  drillTitle.textContent = `${exam.name} ${module.title}`;
  drillSkill.textContent = task.skill;
  drillPrompt.textContent = task.prompt;
  drillTask.textContent = `${module.format} - ${task.task}`;
  drillResponse.value = "";
  drillResponse.placeholder = `Write your ${module.title.toLowerCase()} response for ${exam.name} here.`;
  drillFeedback.textContent = state.isLoggedIn
    ? `Task ${state.currentTaskIndex + 1} of ${module.tasks.length}. ${module.duration}.`
    : "Login or sign up to answer this module and view model answers.";
  drillFeedback.className = "quiz-feedback";
  state.currentTaskCompleted = false;
  document.querySelector("#test-drill-counter").textContent = `${state.currentTaskIndex + 1} / ${module.tasks.length}`;
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
  state.currentModuleIndex = 0;
  state.currentTaskIndex = 0;
  renderDrill();
}

async function completeDrill() {
  if (!state.isLoggedIn) {
    showLoginRequiredMessage();
    return;
  }

  const response = drillResponse.value.trim();
  const task = getCurrentTask();

  if (response.length < 10) {
    drillFeedback.textContent = "Write at least one full sentence before checking the model answer.";
    drillFeedback.className = "quiz-feedback incorrect";
    return;
  }

  if (!state.currentTaskCompleted) {
    state.completedTasks += 1;
    state.currentTaskCompleted = true;
    if (window.BonjourApi?.isServerUser(state.activeUser)) {
      const result = await window.BonjourApi.saveTestAttempt({
        examCode: state.currentExamKey,
        skill: `${getCurrentModule().title}: ${task.skill}`,
        prompt: task.prompt,
        response,
        modelAnswer: task.answer,
        strategy: task.strategy,
      });
      if (result.user) {
        state.activeUser = result.user;
        state.completedTasks = Number(result.user.examCompletedDrills) || state.completedTasks;
      } else if (!result.isUnavailable) {
        setAuthMessage(result.error || "Test attempt could not be saved to the central database.", "error");
      }
    }
  }
  drillFeedback.innerHTML = `
    <strong>Model answer:</strong> ${task.answer}<br>
    <strong>Strategy:</strong> ${task.strategy}
  `;
  drillFeedback.className = "quiz-feedback correct";
  updateStats();
}

function showNextDrill() {
  if (!state.isLoggedIn) {
    showLoginRequiredMessage();
    return;
  }

  const module = getCurrentModule();
  state.currentTaskIndex += 1;

  if (state.currentTaskIndex >= module.tasks.length) {
    state.currentTaskIndex = 0;
    state.currentModuleIndex = (state.currentModuleIndex + 1) % getCurrentExam().modules.length;
  }

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

  state.currentModuleIndex = Number(button.dataset.module);
  state.currentTaskIndex = 0;
  renderDrill();
});

if (examGrid) {
  checkButton.addEventListener("click", completeDrill);
  nextButton.addEventListener("click", showNextDrill);
  levelSelect.addEventListener("change", () => {
    state.selectedLevel = levelSelect.value;
    renderExamCards();
  });
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
}

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

if (examGrid) {
  initializeTestsPage();
}
