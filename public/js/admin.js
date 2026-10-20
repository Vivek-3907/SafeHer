document.addEventListener('DOMContentLoaded', async () => {
  const statsBox = document.getElementById('adminStats');
  const grvBox = document.getElementById('adminGrievances');

  try {
    const stats = await fetch('/api/admin/stats').then((res) => res.json());
    statsBox.innerHTML = `
      <div class="mini-card"><h3>Total Users</h3><p>${stats.totalUsers}</p></div>
      <div class="mini-card"><h3>Alerts</h3><p>${stats.totalSOS}</p></div>
      <div class="mini-card"><h3>Hazards</h3><p>${stats.totalHazards}</p></div>
      <div class="mini-card"><h3>Resolved</h3><p>${stats.resolved}</p></div>
    `;
  } catch (error) {
    statsBox.innerHTML = '<div class="mini-card"><h3>Stats unavailable</h3></div>';
  }

  try {
    const grievances = await fetch('/api/grievances').then((res) => res.json());
    grvBox.innerHTML = grievances.map((item) => `
      <article class="forum-item">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <small>${item.anonymous ? 'Anonymous' : 'Public'} • ${item.status}</small>
        <div class="admin-actions">
          <input type="text" id="resolve-${item.id}" placeholder="Official resolution" />
          <button class="btn btn-primary small" data-resolve="${item.id}">Resolve</button>
        </div>
      </article>
    `).join('');

    grvBox.querySelectorAll('[data-resolve]').forEach((button) => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-resolve');
        const field = document.getElementById(`resolve-${id}`);
        const resolution = field.value.trim() || 'Resolved with verified guidance.';

        await fetch(`/api/grievances/${id}/resolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resolution })
        });

        location.reload();
      });
    });
  } catch (error) {
    grvBox.innerHTML = '<p>Unable to load grievance queue.</p>';
  }
});
