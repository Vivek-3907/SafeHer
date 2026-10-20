document.addEventListener('DOMContentLoaded', () => {
  const quiz = [
    {
      question: 'What should you do immediately after receiving a cyber blackmail threat?',
      options: ['Delete the messages', 'Save evidence and report immediately', 'Ignore it if it is not severe'],
      answer: 'Save evidence and report immediately'
    },
    {
      question: 'Which of these is a valid self-defense priority if under attack?',
      options: ['Protect vulnerable zones like eyes, throat, and knees', 'Stop moving to save energy', 'Use only verbal arguments'],
      answer: 'Protect vulnerable zones like eyes, throat, and knees'
    },
    {
      question: 'What is the best first step before a late-night journey?',
      options: ['Share your route and emergency contacts', 'Travel without notification', 'Keep your phone switched off'],
      answer: 'Share your route and emergency contacts'
    }
  ];

  const container = document.getElementById('quizContainer');
  if (!container) return;

  let score = 0;
  container.innerHTML = quiz.map((item, index) => `
    <div class="quiz-item">
      <h3>${index + 1}. ${item.question}</h3>
      ${item.options.map((option) => `
        <label class="checkbox-row">
          <input type="radio" name="q${index}" value="${option}" />${option}
        </label>
      `).join('')}
    </div>
  `).join('');

  const button = document.createElement('button');
  button.className = 'btn btn-primary';
  button.textContent = 'Check Score';
  button.addEventListener('click', () => {
    score = 0;
    quiz.forEach((item, index) => {
      const answer = document.querySelector(`input[name="q${index}"]:checked`);
      if (answer && answer.value === item.answer) score += 1;
    });
    container.insertAdjacentHTML('beforeend', `<p class="status-message">Your score: ${score}/${quiz.length}</p>`);
  });
  container.appendChild(button);
});
