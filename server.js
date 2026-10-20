const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

const db = {
  users: [
    {
      id: 1,
      name: 'Admin SafeHer',
      email: 'SafeHer6705@gmail.com',
      password: 'SafeHer@#6705',
      guardian: '9876543210',
      role: 'admin',
      language: 'en'
    }
  ],
  emergencyContacts: [
    { id: 1, name: 'Family Guardian', phone: '9876543210', relation: 'Guardian' },
    { id: 2, name: 'Local Police', phone: '112', relation: 'Emergency' }
  ],
  grievances: [
    {
      id: 1,
      title: 'Unsafe route from hostel to college',
      description: 'Streetlights are missing near the old bridge road after 8 PM.',
      anonymous: true,
      status: 'Resolved',
      resolution: 'Reported to local ward office and public lighting was requested.',
      helpful: 9,
      createdAt: new Date().toISOString()
    }
  ],
  reports: [
    { id: 1, title: 'Dark alley near Railway Colony', lat: 23.0225, lng: 72.5714, verified: true },
    { id: 2, title: 'Isolated bus stop near Ghatlodia', lat: 23.0329, lng: 72.5231, verified: false }
  ],
  sosHistory: [],
  safePlaces: [
    { id: 1, type: 'police', name: 'Navrangpura Police Station', lat: 23.0403, lng: 72.5643, phone: '0792631234', address: 'Navrangpura', verified: true },
    { id: 2, type: 'hospital', name: 'Civil Hospital Ahmedabad', lat: 23.0252, lng: 72.5924, phone: '07922680000', address: 'Asarwa', verified: true },
    { id: 3, type: 'helpline', name: '181 Abhayam Centre', lat: 23.0303, lng: 72.5651, phone: '181', address: 'Ahmedabad', verified: true },
    { id: 4, type: 'shelter', name: 'Sakhi One Stop Crisis Centre', lat: 23.0348, lng: 72.5792, phone: '1091', address: 'Satellite', verified: true }
  ]
};

const adminEmail = 'SafeHer6705@gmail.com';
const adminPassword = 'SafeHer@#6705';

function isAdminUser(email, password) {
  return email === adminEmail && password === adminPassword;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'SafeHer API', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, guardian, language } = req.body || {};

  if (!name || !email || !password || !guardian) {
    return res.status(400).json({ error: 'Name, email, password, and guardian contact are required.' });
  }

  const exists = db.users.some((user) => user.email.toLowerCase() === String(email).toLowerCase());

  if (exists) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    guardian,
    role: 'user',
    language: language || 'en'
  };

  db.users.push(newUser);
  res.status(201).json({ message: 'Registration successful.', user: { id: newUser.id, name, email, role: 'user' } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.users.find((account) => account.email.toLowerCase() === String(email).toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  res.json({
    message: 'Login successful.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      guardian: user.guardian,
      language: user.language || 'en'
    }
  });
});

app.get('/api/emergency-contacts', (req, res) => {
  res.json(db.emergencyContacts);
});

app.post('/api/emergency-contacts', (req, res) => {
  const { name, phone, relation } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  const contact = {
    id: Date.now(),
    name,
    phone,
    relation: relation || 'Family'
  };

  db.emergencyContacts.push(contact);
  res.status(201).json(contact);
});

app.delete('/api/emergency-contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = db.emergencyContacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found.' });
  }

  const [removed] = db.emergencyContacts.splice(index, 1);
  res.json({ message: 'Contact deleted.', contact: removed });
});

app.post('/api/sos/broadcast', (req, res) => {
  const { userName, lat, lng, battery, message } = req.body || {};

  const payload = {
    id: Date.now(),
    userName: userName || 'Anonymous User',
    lat: lat || 23.0225,
    lng: lng || 72.5714,
    battery: battery || 88,
    message: message || 'Emergency alert sent from SafeHer.',
    createdAt: new Date().toISOString()
  };

  db.sosHistory.unshift(payload);

  res.json({
    message: 'SOS alert dispatched to emergency contacts.',
    alert: payload,
    waLink: `https://wa.me/?text=${encodeURIComponent(`Emergency! I need help. Location: https://maps.google.com/?q=${payload.lat},${payload.lng} Battery: ${payload.battery}%`)}`,
    smsLink: `sms:?body=${encodeURIComponent(`Emergency! I need help. Location: https://maps.google.com/?q=${payload.lat},${payload.lng} Battery: ${payload.battery}%`)}`
  });
});

app.get('/api/grievances', (req, res) => {
  res.json(db.grievances);
});

app.post('/api/grievances', (req, res) => {
  const { title, description, anonymous } = req.body || {};

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const item = {
    id: Date.now(),
    title,
    description,
    anonymous: Boolean(anonymous),
    status: 'In-Review',
    resolution: '',
    helpful: 0,
    createdAt: new Date().toISOString()
  };

  db.grievances.unshift(item);
  res.status(201).json(item);
});

app.post('/api/grievances/:id/resolve', (req, res) => {
  const { resolution } = req.body || {};
  const id = Number(req.params.id);
  const item = db.grievances.find((entry) => entry.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Grievance not found.' });
  }

  item.status = 'Resolved';
  item.resolution = resolution || 'Resolved with verified guidance.';
  res.json(item);
});

app.post('/api/grievances/:id/helpful', (req, res) => {
  const id = Number(req.params.id);
  const item = db.grievances.find((entry) => entry.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Grievance not found.' });
  }

  item.helpful += 1;
  res.json({ message: 'Marked as helpful.', grievance: item });
});

app.get('/api/safe-places', (req, res) => {
  res.json(db.safePlaces);
});

app.get('/api/reports', (req, res) => {
  res.json(db.reports);
});

app.post('/api/reports', (req, res) => {
  const { title, lat, lng } = req.body || {};

  if (!title || lat === undefined || lng === undefined) {
    return res.status(400).json({ error: 'Title, latitude and longitude are required.' });
  }

  const report = {
    id: Date.now(),
    title,
    lat: Number(lat),
    lng: Number(lng),
    verified: false
  };

  db.reports.push(report);
  res.status(201).json(report);
});

app.patch('/api/reports/:id/verify', (req, res) => {
  const id = Number(req.params.id);
  const item = db.reports.find((report) => report.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Report not found.' });
  }

  item.verified = true;
  res.json(item);
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: db.users.length,
    totalSOS: db.sosHistory.length,
    totalHazards: db.reports.length,
    grievances: db.grievances.length,
    resolved: db.grievances.filter((entry) => entry.status === 'Resolved').length
  });
});

app.post('/api/chat', (req, res) => {
  const message = (req.body && req.body.message) || '';
  const lower = message.toLowerCase();

  let reply = 'I can help with legal safety and emergency guidance. Please share your concern.';

  if (lower.includes('zero') || lower.includes('fir')) {
    reply = 'You can file a Zero FIR at any police station. It is valid under the Bharatiya Nyaya Sanhita (BNS) framework and does not require the complaint to be filed only at the local jurisdiction.';
  } else if (lower.includes('posh') || lower.includes('harassment')) {
    reply = 'For workplace harassment, report to the Internal Complaints Committee (ICC) and preserve evidence such as messages, screenshots, and witness details.';
  } else if (lower.includes('cyber') || lower.includes('blackmail') || lower.includes('online')) {
    reply = 'Save screenshots, block the suspect, report at cybercrime.gov.in, and call the cyber helpline 1930 immediately if there are threats or leaked photos.';
  } else if (lower.includes('safe') || lower.includes('travel')) {
    reply = 'Share your route, keep emergency contacts updated, and use the SafeHer SOS, journey tracking, and safety map before moving alone at night.';
  }

  res.json({ reply });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/sos', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sos.html'));
});

app.get('/grievance', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'grievance.html'));
});

app.get('/empowerment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'empowerment.html'));
});

app.get('/awareness', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'awareness.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SafeHer server running at http://localhost:${PORT}`);
});
