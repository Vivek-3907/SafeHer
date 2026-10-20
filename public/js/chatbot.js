document.addEventListener('DOMContentLoaded', () => {
  const chatbotForm = document.getElementById('chatbotForm');
  if (!chatbotForm) return;

  chatbotForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = document.getElementById('chatInput');
    const output = document.getElementById('chatOutput');
    const msg = input.value.trim();
    if (!msg) return;

    output.textContent = 'SafeHer AI is preparing a response…';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      }).then((res) => res.json());
      output.textContent = response.reply || 'A legal and safety answer will appear here.';
    } catch (error) {
      output.textContent = 'Unable to reach the assistant right now.';
    }
    input.value = '';
  });
});
