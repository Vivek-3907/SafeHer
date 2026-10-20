document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const message = document.getElementById('loginMessage');

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');

        localStorage.setItem('safeher-user', JSON.stringify(data.user));
        message.textContent = 'Login successful.';
        setTimeout(() => {
          window.location.href = data.user.role === 'admin' ? '/admin' : '/dashboard';
        }, 500);
      } catch (error) {
        message.textContent = error.message;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        name: document.getElementById('registerName').value.trim(),
        email: document.getElementById('registerEmail').value.trim(),
        password: document.getElementById('registerPassword').value,
        guardian: document.getElementById('guardianPhone').value.trim(),
        language: document.getElementById('registerLanguage').value
      };

      const message = document.getElementById('registerMessage');

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');

        message.textContent = 'Registration successful. Please login.';
        setTimeout(() => window.location.href = '/login', 700);
      } catch (error) {
        message.textContent = error.message;
      }
    });
  }

  const contactList = document.getElementById('contactList');
  if (contactList) {
    fetch('/api/emergency-contacts')
      .then((res) => res.json())
      .then((contacts) => {
        contactList.innerHTML = contacts.map((contact) => `
          <li>
            <strong>${contact.name}</strong><br />
            ${contact.phone} • ${contact.relation}
          </li>
        `).join('');
      })
      .catch(() => {
        contactList.innerHTML = '<li>No emergency contacts available.</li>';
      });
  }
});
