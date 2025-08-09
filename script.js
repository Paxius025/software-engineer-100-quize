const quizForm = document.getElementById("quiz-form");
const submitButton = document.getElementById("submit-button");
const resultsContainer = document.getElementById("results-container");
const scoreSpan = document.getElementById("score");
const totalQuestionsSpan = document.getElementById("total-questions");
let quizData = [];
let userAnswers = {};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// โหลดข้อมูลจากไฟล์ JSON
fetch("./questions.json")
  .then((response) => response.json())
  .then((data) => {
    quizData = shuffleArray(data);
    totalQuestionsSpan.textContent = quizData.length;
    loadQuiz();
  })
  .catch((error) => console.error("Error loading quiz data:", error));

function loadQuiz() {
  quizData.forEach((question, index) => {
    // หา text ของคำตอบที่ถูกต้องก่อน shuffle
    const correctOptionIndex = question.options.findIndex((opt) =>
      opt.startsWith(question.answer + ".")
    );
    question.correctAnswerText = question.options[correctOptionIndex];

    // shuffle options
    question.options = shuffleArray(question.options);

    const questionElement = document.createElement("div");
    questionElement.classList.add("question");
    questionElement.innerHTML = `<p>${index + 1}. ${question.question}</p>`;

    const optionsList = document.createElement("ul");
    optionsList.classList.add("options-list");

    question.options.forEach((option, optionIndex) => {
      const inputId = `q${index}_o${optionIndex}`;
      optionItem = document.createElement("li");
      optionItem.innerHTML = `
                <input type="radio" id="${inputId}" name="question${index}" value="${option}">
                <label for="${inputId}">${option}</label>
            `;
      optionsList.appendChild(optionItem);
    });

    questionElement.appendChild(optionsList);
    quizForm.appendChild(questionElement);
  });
}

submitButton.addEventListener("click", () => {
  let score = 0;
  quizData.forEach((question, index) => {
    const selectedOption = document.querySelector(
      `input[name="question${index}"]:checked`
    );
    if (selectedOption && selectedOption.value === question.answer) {
      score++;
    }
  });

  scoreSpan.textContent = score;
  resultsContainer.style.display = "block";
  submitButton.style.display = "none";
});

const testButton = document.getElementById("test-button");

testButton.addEventListener("click", () => {
  quizData.forEach((question, index) => {
    const options = document.querySelectorAll(`input[name="question${index}"]`);
    if (options.length > 0) {
      const randomIndex = Math.floor(Math.random() * options.length);
      options[randomIndex].checked = true;
    }
  });

  submitButton.click();

   resultsContainer.scrollIntoView({ behavior: "smooth" });
});

