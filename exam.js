let currentQuestionIndex = 0;
let answers = {};
let remainingTime = examConfig.durationMinutes * 60;
let timerInterval;

// Start timer immediately
startTimer();
renderQuestion();

function startTimer() {
  updateTimerUI();

  timerInterval = setInterval(() => {
    remainingTime--;

    updateTimerUI();

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      alert("Time is up! Exam submitted.");
      submitExam();
    }
  }, 1000);
}

function updateTimerUI() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  document.getElementById("timer").innerText =
    `Time Remaining: ${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function renderQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("question").innerText = q.text;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  if (q.type === "mcq") {
    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="radio" name="answer" value="${opt}">
        ${opt}<br>
      `;
      optionsDiv.appendChild(label);
    });
  } else {
    optionsDiv.innerHTML = `
      <input type="text" id="shortAnswer" />
    `;
  }
}

function nextQuestion() {
  saveAnswer();

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    submitExam();
  }
}

function saveAnswer() {
  const q = questions[currentQuestionIndex];

  if (q.type === "mcq") {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) answers[q.id] = selected.value;
  } else {
    const input = document.getElementById("shortAnswer");
    if (input) answers[q.id] = input.value;
  }
}

function submitExam() {
  clearInterval(timerInterval);
  saveAnswer();

  console.log("Submitted Answers:", answers);

  document.body.innerHTML = `
    <h2>Exam Submitted</h2>
    <pre>${JSON.stringify(answers, null, 2)}</pre>
  `;
}