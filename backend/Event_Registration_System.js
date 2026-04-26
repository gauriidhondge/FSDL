/*
 * ============================================================
 *  EVENT REGISTRATION SYSTEM
 *  Tech Stack: Node.js + Express + MongoDB (Mongoose)
 *  Features: Register for events, View registrations, Delete
 *
 *  HOW TO RUN:
 *  1. Make sure Node.js and MongoDB are installed
 *  2. Run: npm install express mongoose
 *  3. Start MongoDB: mongod
 *  4. Run: node Event_Registration_System.js
 *  5. Open browser: http://localhost:3001
 * ============================================================
 */

// ===== IMPORTS =====
const express  = require('express');
const mongoose = require('mongoose');

const app  = express();
const PORT = 3001; // Different port from student system

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== DATABASE CONNECTION =====
mongoose.connect('mongodb://localhost:27017/eventdb')
  .then(() => console.log('✅ Connected to MongoDB — eventdb'))
  .catch(err => console.error('❌ Error:', err));

// ===== EVENT REGISTRATION SCHEMA =====
// Defines the shape of participant documents in MongoDB
const registrationSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  eventName:   { type: String, required: true },
  college:     { type: String },
  tshirtSize:  { type: String, enum: ['S','M','L','XL','XXL'], default: 'M' },
  registeredAt:{ type: Date, default: Date.now } // auto timestamp
});

// ===== MODEL =====
// Creates 'registrations' collection in MongoDB
const Registration = mongoose.model('Registration', registrationSchema);

// ===== HTML FRONTEND =====
const htmlPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Event Registration System</title>
  <style>
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Segoe UI',sans-serif; background:#1a1a2e; color:white; padding:30px 20px; min-height:100vh; }
    h1   { text-align:center; margin-bottom:8px; font-size:26px; color:#e94560; }
    p.sub{ text-align:center; color:#666; margin-bottom:24px; font-size:13px; }

    .container { max-width:1000px; margin:0 auto; }

    /* EVENT TABS */
    .event-tabs { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:24px; }
    .event-tab {
      padding:8px 18px; border:2px solid #333; background:transparent; color:#888;
      border-radius:25px; cursor:pointer; font-size:13px; transition:all 0.3s;
    }
    .event-tab.active { background:#e94560; border-color:#e94560; color:white; }

    /* TWO COLUMN LAYOUT */
    .two-col { display:flex; gap:22px; flex-wrap:wrap; }

    /* FORM */
    .form-card { background:#16213e; border:1px solid #0f3460; border-radius:14px; padding:24px; flex:1; min-width:280px; }
    .form-card h2 { margin-bottom:18px; font-size:17px; color:#e94560; }
    input, select { width:100%; padding:10px; border:1px solid #333; background:#0f3460; border-radius:8px; font-size:14px; margin-bottom:12px; outline:none; color:white; }
    input:focus { border-color:#e94560; }
    .btn { width:100%; padding:12px; background:#e94560; color:white; border:none; border-radius:8px; font-size:14px; cursor:pointer; font-weight:700; }
    .btn:hover { background:#c0392b; }
    #msg { padding:10px; border-radius:6px; margin-bottom:12px; font-size:13px; display:none; }
    .success { background:#eafaf1; color:#27ae60; }
    .error   { background:#fdedec; color:#e74c3c; }

    /* REGISTRATIONS TABLE */
    .table-card { background:#16213e; border:1px solid #0f3460; border-radius:14px; padding:22px; flex:2; min-width:300px; overflow-x:auto; }
    .table-card h2 { margin-bottom:14px; font-size:17px; color:#e94560; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    thead tr { background:#0f3460; }
    th, td { padding:10px 12px; text-align:left; border-bottom:1px solid #0f3460; }
    tbody tr:hover { background:rgba(255,255,255,0.04); }
    .del-btn { background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; }

    /* STATS */
    .stats { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px; }
    .stat { background:#0f3460; border-radius:10px; padding:12px 18px; text-align:center; flex:1; }
    .stat .num { font-size:24px; font-weight:800; color:#e94560; }
    .stat .lbl { font-size:11px; color:#888; }

    .event-badge { background:#e94560; color:white; font-size:10px; padding:2px 8px; border-radius:10px; }
  </style>
</head>
<body>
  <h1>🎪 Event Registration System</h1>
  <p class="sub">Register participants for upcoming events</p>

  <div class="container">

    <!-- STATS -->
    <div class="stats">
      <div class="stat"><div class="num" id="totalStat">0</div><div class="lbl">Total Registrations</div></div>
      <div class="stat"><div class="num" id="eventCount">4</div><div class="lbl">Available Events</div></div>
    </div>

    <!-- EVENT FILTER TABS -->
    <div class="event-tabs">
      <button class="event-tab active" onclick="filterEvent('All',this)">All</button>
      <button class="event-tab" onclick="filterEvent('Hackathon 2025',this)">🏆 Hackathon 2025</button>
      <button class="event-tab" onclick="filterEvent('Tech Talk',this)">🎤 Tech Talk</button>
      <button class="event-tab" onclick="filterEvent('Cultural Fest',this)">🎭 Cultural Fest</button>
      <button class="event-tab" onclick="filterEvent('Sports Meet',this)">⚽ Sports Meet</button>
    </div>

    <div class="two-col">
      <!-- REGISTRATION FORM -->
      <div class="form-card">
        <h2>📝 New Registration</h2>
        <div id="msg"></div>
        <input type="text"  id="name"  placeholder="Participant Name *" />
        <input type="email" id="email" placeholder="Email Address *" />
        <input type="tel"   id="phone" placeholder="Phone Number *" />
        <select id="eventName">
          <option value="">-- Select Event --</option>
          <option>Hackathon 2025</option>
          <option>Tech Talk</option>
          <option>Cultural Fest</option>
          <option>Sports Meet</option>
        </select>
        <input type="text" id="college" placeholder="College Name (optional)" />
        <select id="tshirtSize">
          <option value="M">T-Shirt Size: M</option>
          <option value="S">S</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
        <button class="btn" onclick="register()">🎟 Register Now</button>
      </div>

      <!-- REGISTRATIONS TABLE -->
      <div class="table-card">
        <h2 id="tableTitle">📋 All Registrations (<span id="count">0</span>)</h2>
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Event</th><th>College</th><th>Action</th></tr>
          </thead>
          <tbody id="tableBody">
            <tr><td colspan="6" style="text-align:center;color:#555;padding:20px">Loading...</td></tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>

  <script>
    let currentFilter = 'All';

    async function loadRegistrations() {
      const url = currentFilter === 'All' ? '/api/registrations' : '/api/registrations?event=' + encodeURIComponent(currentFilter);
      const res  = await fetch(url);
      const data = await res.json();
      const tbody = document.getElementById('tableBody');
      document.getElementById('count').textContent = data.length;
      document.getElementById('totalStat').textContent = data.length;

      if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#555;padding:20px">No registrations found.</td></tr>';
        return;
      }
      tbody.innerHTML = data.map((r, i) => \`
        <tr>
          <td>\${i+1}</td>
          <td>\${r.name}</td>
          <td>\${r.email}</td>
          <td><span class="event-badge">\${r.eventName}</span></td>
          <td>\${r.college || '—'}</td>
          <td><button class="del-btn" onclick="deleteReg('\${r._id}')">🗑</button></td>
        </tr>
      \`).join('');
    }

    async function register() {
      const name      = document.getElementById('name').value.trim();
      const email     = document.getElementById('email').value.trim();
      const phone     = document.getElementById('phone').value.trim();
      const eventName = document.getElementById('eventName').value;
      const college   = document.getElementById('college').value.trim();
      const tshirtSize= document.getElementById('tshirtSize').value;

      if (!name || !email || !phone || !eventName) {
        showMsg('Please fill all required fields!', 'error');
        return;
      }

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, eventName, college, tshirtSize })
      });
      const data = await res.json();

      if (res.ok) {
        showMsg('✅ Registered successfully!', 'success');
        ['name','email','phone','college'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('eventName').value = '';
        loadRegistrations();
      } else {
        showMsg('❌ ' + (data.message || 'Error'), 'error');
      }
    }

    async function deleteReg(id) {
      if (!confirm('Remove this registration?')) return;
      await fetch('/api/registrations/' + id, { method: 'DELETE' });
      loadRegistrations();
    }

    function filterEvent(event, btn) {
      currentFilter = event;
      document.querySelectorAll('.event-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tableTitle').innerHTML = (event === 'All' ? '📋 All Registrations' : '📋 ' + event + ' Registrations') + ' (<span id="count">0</span>)';
      loadRegistrations();
    }

    function showMsg(text, type) {
      const el = document.getElementById('msg');
      el.textContent = text; el.className = type; el.style.display = 'block';
      setTimeout(() => el.style.display = 'none', 3000);
    }

    loadRegistrations();
  </script>
</body>
</html>
`;

// ===== SERVE HTML =====
app.get('/', (req, res) => res.send(htmlPage));

// ===== GET /api/registrations =====
// Returns all registrations, optionally filtered by event name
// ?event=Hackathon filters by that event
app.get('/api/registrations', async (req, res) => {
  try {
    // Build filter: if ?event= param exists, filter by eventName
    const filter = req.query.event ? { eventName: req.query.event } : {};
    const registrations = await Registration.find(filter).sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== POST /api/registrations =====
// Creates a new registration document in MongoDB
app.post('/api/registrations', async (req, res) => {
  try {
    const { name, email, phone, eventName, college, tshirtSize } = req.body;
    const reg = new Registration({ name, email, phone, eventName, college, tshirtSize });
    await reg.save(); // saves to MongoDB
    res.status(201).json({ message: 'Registered!', registration: reg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== DELETE /api/registrations/:id =====
// Removes a registration document by its MongoDB _id
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registration deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🎪 Event Registration System: http://localhost:${PORT}`);
});
