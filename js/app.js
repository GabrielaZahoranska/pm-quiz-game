/*-------------- Constants -------------*/
/* Define quiz question data for both available quizzes */

// General PM Quiz
const generalQuiz = [
  {
    question: "What does MVP stand for in product management?",
    options: [
      "Most Valuable Product",
      "Minimum Viable Product",
      "Managed Value Process",
      "Modern Visual Prototype"
    ],
    answer: "Minimum Viable Product"
  },
  {
    question: "What is the main goal of a product roadmap?",
    options: [
      "Track developer performance",
      "Outline product vision and priorities",
      "Manage marketing campaigns",
      "Plan office resources"
    ],
    answer: "Outline product vision and priorities"
  },
  {
    question: "Which method is used to validate assumptions early in product development?",
    options: [
      "A/B testing",
      "Brainstorming",
      "Budget forecasting",
      "Retrospective analysis"
    ],
    answer: "A/B testing"
  },
  {
    question: "Who is responsible for defining product success metrics?",
    options: ["CEO", "Scrum Master", "Product Manager", "UX Designer"],
    answer: "Product Manager"
  },
  {
    question: "What does the 'Build-Measure-Learn' loop belong to?",
    options: ["Design Thinking", "Agile Manifesto", "Lean Startup", "Waterfall Model"],
    answer: "Lean Startup"
  }
]

// PM Books Quiz
const booksQuiz = [
  {
    question: "Who wrote 'Inspired'?",
    options: ["Marty Cagan", "Ken Norton", "Ben Horowitz", "Eric Ries"],
    answer: "Marty Cagan"
  },
  {
    question: "Who wrote 'The Lean Startup'?",
    options: ["Ben Horowitz", "Marty Cagan", "Eric Ries", "Andy Grove"],
    answer: "Eric Ries"
  },
  {
    question: "Who wrote 'Measure What Matters'?",
    options: ["John Doerr", "Andy Grove", "Reid Hoffman", "Bill Campbell"],
    answer: "John Doerr"
  },
  {
    question: "Who wrote 'The Hard Thing About Hard Things'?",
    options: ["Ben Horowitz", "Marc Andreessen", "Peter Thiel", "Reid Hoffman"],
    answer: "Ben Horowitz"
  },
  {
    question: "Who wrote 'Hooked: How to Build Habit-Forming Products'?",
    options: ["Nir Eyal", "Eric Ries", "Marty Cagan", "Steve Blank"],
    answer: "Nir Eyal"
  }
]

/*---------- Variables (state) ---------*/
/* Store current state of the quiz */
let currentQuiz = null
let currentQuestionIndex = 0
let score = 0
let quizCompleted = false
let totalQuestions = 0

/*----- Cached Element References  -----*/
/* Cache key elements from the DOM for faster access */
const quizContainer = document.getElementById("quiz-container")
const questionEl = document.getElementById("question")
const optionsEl = document.getElementById("options")
const nextBtn = document.getElementById("next-btn")
const resultContainer = document.getElementById("result-container")
const resultMsg = document.getElementById("result-message")
const finalScore = document.getElementById("final-score")
const restartBtn = document.getElementById("restart-btn")
const quizButtons = document.querySelectorAll(".quiz-btn")
const questionContainer = document.getElementById("question-container")

/*-------------- Functions -------------*/

/**
 * Initializes and starts the chosen quiz.
 */
function startQuiz(quiz) {
  currentQuiz = quiz
  currentQuestionIndex = 0
  score = 0
  quizCompleted = false
  totalQuestions = quiz.length

  // Hide quiz selection buttons, show question section
  document.getElementById("quiz-selection").classList.add("hidden")
  document.getElementById("instructions").classList.add("hidden") 
  resultContainer.classList.add("hidden")
  questionContainer.classList.remove("hidden")

  renderQuestion()
}

/**
 * Renders a question and its answer options.
 */
function renderQuestion() {
  nextBtn.classList.add("hidden") // hide Next until an answer is chosen

  const currentQuestion = currentQuiz[currentQuestionIndex]
  questionEl.textContent = currentQuestion.question
  optionsEl.innerHTML = ""

  // Create an answer button for each option
  currentQuestion.options.forEach(option => {
    const btn = document.createElement("button")
    btn.textContent = option
    btn.addEventListener("click", () => handleAnswer(option, currentQuestion.answer, btn))
    optionsEl.appendChild(btn)
  })
}

/**
 * Handles user answer selection and provides feedback.
 */
function handleAnswer(selected, correct, btn) {
  const buttons = optionsEl.querySelectorAll("button")

  // Disable all buttons after user chooses an answer
  buttons.forEach(b => (b.disabled = true))

  // Check answer correctness
  if (selected === correct) {
    btn.classList.add("correct")
    score++
  } else {
    btn.classList.add("wrong")
    // highlight correct answer
    buttons.forEach(b => {
      if (b.textContent === correct) b.classList.add("correct")
    })
  }

  // Show Next button after answer is given
  nextBtn.classList.remove("hidden")
}

/**
 * Moves to the next question or shows results when finished.
 */
function nextQuestion() {
  currentQuestionIndex++
  if (currentQuestionIndex < totalQuestions) {
    renderQuestion()
  } else {
    showResults()
  }
}

/**
 * Simple confetti animation when user performs well.
 */
function launchConfetti() {
  const duration = 3 * 1000 // run for 3 seconds
  const animationEnd = Date.now() + duration

  const defaults = { spread: 60, startVelocity: 25, elementCount: 50, decay: 0.9 }

  const randomInRange = (min, max) => Math.random() * (max - min) + min

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount = 30 * (timeLeft / duration)
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: Math.random() - 0.2
      }
    }))
  }, 250)
}

/**
 * Displays final results and message after quiz completion.
 */
function showResults() {
  quizCompleted = true

  // Hide question area and show results
  questionContainer.classList.add("hidden")
  resultContainer.classList.remove("hidden")
  resultContainer.style.display = "flex"

  const percentage = (score / totalQuestions) * 100
  let msg = ""

  if (percentage >= 80) {
    msg = "Excellent!"
    launchConfetti() // confetti celebration for high scores
  } else if (percentage >= 50) {
    msg = "Good job!"
  } else {
    msg = "Try again!"
  }

  resultMsg.textContent = msg
  finalScore.textContent = `You scored ${score} out of ${totalQuestions}`
}

/**
 * Resets all variables and brings user back to quiz selection menu.
 */
function restartQuiz() {
  // Reset core state
  currentQuiz = null
  currentQuestionIndex = 0
  score = 0
  quizCompleted = false

  // Hide sections that might still be visible
  questionContainer.classList.add("hidden")
  resultContainer.classList.add("hidden")

  // Clear inline display styles set by showResults()
  resultContainer.style.display = ""
  questionContainer.style.display = ""

  // Reset UI text
  questionEl.textContent = ""
  optionsEl.innerHTML = ""
  resultMsg.textContent = ""
  finalScore.textContent = ""

  // Hide Next button
  nextBtn.classList.add("hidden")

  // Reveal quiz selection buttons again
  const selection = document.getElementById("quiz-selection")
  if (selection) selection.classList.remove("hidden")

  const instructions = document.getElementById("instructions")
  if (instructions) instructions.classList.remove("hidden")

  // Scroll to top smoothly for better UX
  window.scrollTo({ top: 0, behavior: "smooth" })
}

/*----------- Event Listeners ----------*/
/* Handle button clicks and quiz navigation */

// When user clicks a quiz type button
quizButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const quizType = btn.getAttribute("data-quiz")
    startQuiz(quizType === "general" ? generalQuiz : booksQuiz)
  })
})

// Next question button
nextBtn.addEventListener("click", nextQuestion)

// Restart button after results
restartBtn.addEventListener("click", restartQuiz)
