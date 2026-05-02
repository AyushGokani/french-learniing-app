const examPractice = window.BONJOUR_EXAM_PRACTICE || {};
const SESSION_KEY = "bonjourBuddySession";

const state = {
  activeUser: null,
  examKey: "TEF",
  moduleIndex: 0,
  taskIndex: 0,
  level: "B2",
  mediaRecorder: null,
  audioChunks: [],
  recordedAudio: null,
  completed: false,
};

const backLink = document.querySelector("#section-back-link");
const eyebrow = document.querySelector("#section-eyebrow");
const title = document.querySelector("#section-title");
const description = document.querySelector("#section-description");
const levelSelect = document.querySelector("#section-level");
const meta = document.querySelector("#section-meta");
const taskCounter = document.querySelector("#section-task-counter");
const promptText = document.querySelector("#section-task-prompt");
const taskText = document.querySelector("#section-task-instructions");
const response = document.querySelector("#section-response");
const answerButton = document.querySelector("#section-answer-button");
const nextButton = document.querySelector("#next-section-task");
const feedback = document.querySelector("#section-feedback");
const audioPanel = document.querySelector("#section-audio-panel");
const audioText = document.querySelector("#section-audio-text");
const playAudioButton = document.querySelector("#section-play-audio");
const recorderPanel = document.querySelector("#section-recorder-panel");
const recordButton = document.querySelector("#section-record");
const stopButton = document.querySelector("#section-stop");
const audioPlayback = document.querySelector("#section-audio-playback");
const recordingStatus = document.querySelector("#section-recording-status");
const moduleList = document.querySelector("#section-module-list");

function getParams() {
  const params = new URLSearchParams(window.location.search);
  state.examKey = params.get("exam") || "TEF";
  state.moduleIndex = Number(params.get("module")) || 0;
  state.level = params.get("level") || "B2";
}

function getExam() {
  return examPractice[state.examKey] || examPractice.TEF;
}

function getModule() {
  return getExam().modules[state.moduleIndex] || getExam().modules[0];
}

function getTask() {
  return getModule().tasks[state.taskIndex];
}

function isListeningSection(module) {
  return module.section === "Listening";
}

function isSpeakingSection(module) {
  return module.section === "Speaking";
}

function setFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = type ? `test-feedback ${type}` : "test-feedback";
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    setFeedback("Audio playback is not supported in this browser.", "incorrect");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  window.speechSynthesis.speak(utterance);
}

function renderModuleList() {
  const exam = getExam();
  moduleList.innerHTML = exam.modules
    .map(
      (module, index) => `
        <a class="${index === state.moduleIndex ? "active" : ""}" href="section.html?exam=${state.examKey}&module=${index}&level=${state.level}">
          <strong>${module.title}</strong>
          <span>${module.duration}</span>
        </a>
      `
    )
    .join("");
}

function renderSection() {
  const exam = getExam();
  const module = getModule();
  const task = getTask();

  backLink.href = `tests.html#test-workspace`;
  eyebrow.textContent = `${exam.name} ${state.level} section`;
  title.textContent = module.title;
  description.textContent = module.instructions;
  levelSelect.value = state.level;
  meta.innerHTML = `
    <span>${module.duration}</span>
    <span>${module.format}</span>
    <span>${module.tasks.length} tasks</span>
  `;
  taskCounter.textContent = `${state.taskIndex + 1} / ${module.tasks.length}`;
  promptText.textContent = task.prompt;
  taskText.textContent = task.task;
  response.value = "";
  response.placeholder = isSpeakingSection(module)
    ? "Write notes here, then record your spoken answer below."
    : `Write your ${module.title.toLowerCase()} answer for ${exam.name} ${state.level}.`;
  state.recordedAudio = null;
  state.completed = false;
  audioPlayback.classList.add("hidden");
  audioPlayback.removeAttribute("src");
  recordingStatus.textContent = "No recording yet.";
  setFeedback("");

  audioPanel.classList.toggle("hidden", !isListeningSection(module));
  audioText.textContent = isListeningSection(module)
    ? task.prompt.replace("You hear: ", "").replace(/^"|"$/g, "")
    : "";
  recorderPanel.classList.toggle("hidden", !isSpeakingSection(module));

  renderModuleList();
}

async function restoreSession() {
  if (window.BonjourApi) {
    const result = await window.BonjourApi.getCurrentUser();
    if (result.user) {
      state.activeUser = result.user;
      return;
    }
  }

  const localEmail = localStorage.getItem(SESSION_KEY);
  if (localEmail) {
    state.activeUser = { email: localEmail, name: "Local learner" };
  }
}

async function submitSectionTask() {
  if (!state.activeUser) {
    setFeedback("Please log in on the tests page before submitting section tasks.", "incorrect");
    return;
  }

  const module = getModule();
  const task = getTask();
  const answerText = response.value.trim();

  if (!answerText && !state.recordedAudio) {
    setFeedback("Write an answer or record audio before checking the model answer.", "incorrect");
    return;
  }

  if (!state.completed) {
    state.completed = true;
    if (window.BonjourApi?.isServerUser(state.activeUser)) {
      const result = await window.BonjourApi.saveTestAttempt({
        examCode: state.examKey,
        skill: `${module.title}: ${task.skill}`,
        prompt: task.prompt,
        responseText: state.recordedAudio
          ? `${answerText}\n\n[Audio recording captured in browser: ${state.recordedAudio.size} bytes]`
          : answerText,
        modelAnswer: task.answer,
        strategy: task.strategy,
        audioData: state.recordedAudio ? `browser-recording:${state.recordedAudio.size}:audio/webm` : "",
      });
      if (result.user) {
        state.activeUser = result.user;
      }
    }
  }

  feedback.innerHTML = `
    <strong>Model answer:</strong> ${task.answer}<br>
    <strong>Strategy:</strong> ${task.strategy}
  `;
  feedback.className = "test-feedback correct";
}

function nextTask() {
  const module = getModule();
  state.taskIndex = (state.taskIndex + 1) % module.tasks.length;
  renderSection();
}

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    setFeedback("Audio recording is not supported in this browser.", "incorrect");
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  state.audioChunks = [];
  state.mediaRecorder = new MediaRecorder(stream);
  state.mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      state.audioChunks.push(event.data);
    }
  };
  state.mediaRecorder.onstop = () => {
    state.recordedAudio = new Blob(state.audioChunks, { type: "audio/webm" });
    audioPlayback.src = URL.createObjectURL(state.recordedAudio);
    audioPlayback.classList.remove("hidden");
    recordingStatus.textContent = "Recording ready. You can play it back before submitting.";
    stream.getTracks().forEach((track) => track.stop());
  };

  state.mediaRecorder.start();
  recordButton.disabled = true;
  stopButton.disabled = false;
  recordingStatus.textContent = "Recording...";
}

function stopRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
    state.mediaRecorder.stop();
  }
  recordButton.disabled = false;
  stopButton.disabled = true;
}

levelSelect.addEventListener("change", () => {
  state.level = levelSelect.value;
  renderModuleList();
});
playAudioButton.addEventListener("click", () => speakText(audioText.textContent));
answerButton.addEventListener("click", submitSectionTask);
nextButton.addEventListener("click", nextTask);
recordButton.addEventListener("click", () => {
  startRecording().catch(() => {
    setFeedback("Could not start recording. Check microphone permissions.", "incorrect");
  });
});
stopButton.addEventListener("click", stopRecording);

getParams();
restoreSession()
  .catch(() => {})
  .finally(renderSection);
