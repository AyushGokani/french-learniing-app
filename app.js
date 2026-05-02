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

const state = {
  completedActivities: Number(localStorage.getItem("completedActivities")) || 0,
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
  localStorage.setItem("completedActivities", String(state.completedActivities));
}

function addProgress() {
  state.completedActivities += 1;
  updateProgress();
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

renderLessons();
renderFlashcard();
renderQuizQuestion();
updateProgress();
