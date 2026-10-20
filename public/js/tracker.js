document.addEventListener('DOMContentLoaded', () => {
  const journeyForm = document.getElementById('journeyForm');
  if (!journeyForm) return;

  journeyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const destination = document.getElementById('destinationInput').value.trim();
    const minutes = Number(document.getElementById('minutesInput').value || 30);
    const output = document.getElementById('journeyStatus');
    output.textContent = `Tracking trip to ${destination || 'destination'} for ${minutes} minutes.`;
  });
});
