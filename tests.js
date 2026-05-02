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

const state = {
  currentExamKey: "TEF",
  currentDrillIndex: 0,
  completedDrills: Number(localStorage.getItem("examCompletedDrills")) || 0,
};

const examGrid = document.querySelector("#test-path-grid");
const skillButtons = document.querySelector("#test-skill-list");
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
  localStorage.setItem("examCompletedDrills", String(state.completedDrills));
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
          <button class="button ${examKey === state.currentExamKey ? "primary" : "secondary"} test-select" type="button" data-exam="${examKey}">
            ${examKey === state.currentExamKey ? "Selected" : `Choose ${exam.name}`}
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
        <button class="skill-button ${index === state.currentDrillIndex ? "active" : ""}" type="button" data-drill="${index}">
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
  drillFeedback.textContent = "";
  drillFeedback.className = "quiz-feedback";
  renderExamCards();
  renderSkillButtons();
  updateStats();
}

function selectExam(examKey) {
  state.currentExamKey = examKey;
  state.currentDrillIndex = 0;
  renderDrill();
}

function completeDrill() {
  const response = drillResponse.value.trim();
  const drill = getCurrentDrill();

  if (response.length < 10) {
    drillFeedback.textContent = "Write at least one full sentence before checking the model answer.";
    drillFeedback.className = "quiz-feedback incorrect";
    return;
  }

  state.completedDrills += 1;
  drillFeedback.innerHTML = `
    <strong>Model answer:</strong> ${drill.answer}<br>
    <strong>Strategy:</strong> ${drill.strategy}
  `;
  drillFeedback.className = "quiz-feedback correct";
  updateStats();
}

function showNextDrill() {
  const drills = getCurrentExam().drills;
  state.currentDrillIndex = (state.currentDrillIndex + 1) % drills.length;
  renderDrill();
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

  state.currentDrillIndex = Number(button.dataset.drill);
  renderDrill();
});

checkButton.addEventListener("click", completeDrill);
nextButton.addEventListener("click", showNextDrill);

renderDrill();
