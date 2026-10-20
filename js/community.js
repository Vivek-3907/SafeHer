document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('grievanceList');
  const form = document.getElementById('grievanceForm');
  const message = document.getElementById('grievanceMessage');

  async function loadGrievances() {
    try {
      const grievances = await fetch('/api/grievances').then((res) => res.json());
      list.innerHTML = grievances.map((item) => `
        <article class="forum-item">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <small>${item.anonymous ? 'Anonymous' : 'Public'} • ${item.status}</small>
          <p>${item.resolution || 'Awaiting official guidance.'}</p>
          <button class="btn btn-secondary small" data-helpful="${item.id}">Helpful (${item.helpful})</button>
        </article>
      `).join('');

      list.querySelectorAll('[data-helpful]').forEach((button) => {
        button.addEventListener('click', async () => {
          const id = button.getAttribute('data-helpful');
          await fetch(`/api/grievances/${id}/helpful`, { method: 'POST' });
          loadGrievances();
        });
      });
    } catch (error) {
      list.innerHTML = '<p>Unable to load grievances.</p>';
    }
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const title = document.getElementById('grievanceTitle').value.trim();
      const description = document.getElementById('grievanceDescription').value.trim();
      const anonymous = document.getElementById('grievanceAnonymous').checked;

      try {
        const response = await fetch('/api/grievances', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, anonymous })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to post objection');
        message.textContent = 'Grievance submitted successfully.';
        form.reset();
        loadGrievances();
      } catch (error) {
        message.textContent = error.message;
      }
    });
  }

  loadGrievances();
});
