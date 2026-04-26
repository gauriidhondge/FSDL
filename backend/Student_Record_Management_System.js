/*
 * ============================================================
 *  STUDENT RECORD MANAGEMENT SYSTEM
 *  Tech Stack: Node.js + Express + MongoDB (Mongoose)
 *  Features: Add / View / Delete student records (CRUD)
 *
 *  HOW TO RUN:
 *  1. Make sure Node.js and MongoDB are installed
 *  2. Run: npm install express mongoose
 *  3. Start MongoDB: mongod
 *  4. Run this file: node Student_Record_Management_System.js
 *  5. Open browser: http://localhost:3000
 * ============================================================
 */

// ===== IMPORTS =====
const express  = require('express');   // Web server framework
const mongoose = require('mongoose');  // MongoDB ODM (Object Document Mapper)
const path     = require('path');

const app  = express();
const PORT = 3000;

// ===== MIDDLEWARE =====
// Parses JSON bodies from POST requests
app.use(express.json());

// Parses form-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));

// ===== CONNECT TO MONGODB =====
// mongoose.connect() establishes connection to local MongoDB
// 'studentdb' is the database name (auto-created if not exists)
mongoose.connect('mongodb://localhost:27017/studentdb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ===== MONGOOSE SCHEMA =====
// Schema defines the structure of documents in MongoDB collection
// Think of it like a table structure in SQL
const studentSchema = new mongoose.Schema({
  name:    { type: String, required: true },   // required = not null
  rollNo:  { type: String, required: true, unique: true }, // unique = like primary key
  branch:  { type: String, required: true },
  year:    { type: String, required: true },
  email:   { type: String },
  phone:   { type: String },
  cgpa:    { type: Number },
  createdAt: { type: Date, default: Date.now } // auto-set on insert
});

// ===== MODEL =====
// Model is a constructor compiled from Schema
// 'Student' creates a collection named 'students' in MongoDB
const Student = mongoose.model('Student', studentSchema);

// ===== HTML FRONTEND =====
// We serve a simple HTML page for the UI
// In real projects this would be a separate file / React frontend
const htmlPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Student Record Management</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; padding: 30px 20px; }
    h1 { text-align: center; color: #2c3e50; margin-bottom: 24px; }
    .container { max-width: 1000px; margin: 0 auto; }
    .two-col { display: flex; gap: 24px; flex-wrap: wrap; }

    /* FORM */
    .form-card { background: white; border-radius: 12px; padding: 24px; flex: 1; min-width: 280px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .form-card h2 { margin-bottom: 18px; color: #2c3e50; font-size: 17px; }
    input, select { width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; font-size:14px; margin-bottom:12px; outline:none; }
    input:focus { border-color:#3498db; }
    .btn { width:100%; padding:12px; background:#2c3e50; color:white; border:none; border-radius:8px; font-size:14px; cursor:pointer; }
    .btn:hover { background:#3498db; }
    #msg { padding:10px; border-radius:6px; margin-bottom:12px; font-size:13px; display:none; }
    .success { background:#eafaf1; color:#27ae60; }
    .error   { background:#fdedec; color:#e74c3c; }

    /* TABLE */
    .table-card { background: white; border-radius: 12px; padding: 24px; flex: 2; min-width: 300px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); overflow-x:auto; }
    .table-card h2 { margin-bottom:14px; color:#2c3e50; font-size:17px; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    thead tr { background:#2c3e50; color:white; }
    th, td { padding:10px 12px; text-align:left; border-bottom:1px solid #eee; }
    tbody tr:hover { background:#f8f9fa; }
    .del-btn { background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; }
    .del-btn:hover { background:#c0392b; }
  </style>
</head>
<body>
  <h1>🎓 Student Record Management System</h1>
  <div class="container">
    <div class="two-col">

      <!-- ADD STUDENT FORM -->
      <div class="form-card">
        <h2>➕ Add Student</h2>
        <div id="msg"></div>
        <input type="text" id="name"   placeholder="Full Name *" />
        <input type="text" id="rollNo" placeholder="Roll Number * (e.g. BE22CS001)" />
        <select id="branch">
          <option value="">-- Select Branch --</option>
          <option>Computer Engineering</option>
          <option>IT</option>
          <option>Electronics</option>
          <option>Mechanical</option>
        </select>
        <select id="year">
          <option value="">-- Select Year --</option>
          <option>First Year</option><option>Second Year</option>
          <option>Third Year</option><option>Fourth Year</option>
        </select>
        <input type="email"  id="email" placeholder="Email (optional)" />
        <input type="text"   id="cgpa"  placeholder="CGPA (e.g. 8.5)" />
        <button class="btn" onclick="addStudent()">Add Student</button>
      </div>

      <!-- STUDENT TABLE -->
      <div class="table-card">
        <h2>📋 All Students (<span id="count">0</span>)</h2>
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Roll No</th><th>Branch</th><th>Year</th><th>CGPA</th><th>Action</th></tr>
          </thead>
          <tbody id="tableBody">
            <tr><td colspan="7" style="text-align:center;color:#aaa;padding:20px">Loading...</td></tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>

  <script>
    // ===== LOAD ALL STUDENTS (GET Request) =====
    async function loadStudents() {
      const res  = await fetch('/api/students');
      const data = await res.json();
      const tbody = document.getElementById('tableBody');
      document.getElementById('count').textContent = data.length;

      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#aaa;padding:20px">No students found.</td></tr>';
        return;
      }
      tbody.innerHTML = data.map((s, i) => \`
        <tr>
          <td>\${i+1}</td>
          <td>\${s.name}</td>
          <td>\${s.rollNo}</td>
          <td>\${s.branch}</td>
          <td>\${s.year}</td>
          <td>\${s.cgpa || '—'}</td>
          <td><button class="del-btn" onclick="deleteStudent('\${s._id}')">🗑 Delete</button></td>
        </tr>
      \`).join('');
    }

    // ===== ADD STUDENT (POST Request) =====
    async function addStudent() {
      const name   = document.getElementById('name').value.trim();
      const rollNo = document.getElementById('rollNo').value.trim();
      const branch = document.getElementById('branch').value;
      const year   = document.getElementById('year').value;
      const email  = document.getElementById('email').value.trim();
      const cgpa   = document.getElementById('cgpa').value;
      const msg    = document.getElementById('msg');

      if (!name || !rollNo || !branch || !year) {
        showMsg('Please fill all required fields!', 'error');
        return;
      }

      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rollNo, branch, year, email, cgpa: parseFloat(cgpa) || null })
      });
      const data = await res.json();

      if (res.ok) {
        showMsg('✅ Student added successfully!', 'success');
        // Clear form
        ['name','rollNo','email','cgpa'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('branch').value = '';
        document.getElementById('year').value   = '';
        loadStudents();
      } else {
        showMsg('❌ ' + (data.message || 'Error adding student'), 'error');
      }
    }

    // ===== DELETE STUDENT (DELETE Request) =====
    async function deleteStudent(id) {
      if (!confirm('Delete this student?')) return;
      await fetch('/api/students/' + id, { method: 'DELETE' });
      loadStudents();
    }

    function showMsg(text, type) {
      const el = document.getElementById('msg');
      el.textContent = text;
      el.className = type;
      el.style.display = 'block';
      setTimeout(() => el.style.display = 'none', 3000);
    }

    loadStudents(); // load on page start
  </script>
</body>
</html>
`;

// ===== ROUTES =====

// Serve HTML page
app.get('/', (req, res) => res.send(htmlPage));

// ===== GET /api/students =====
// Retrieves all students from MongoDB
// .find({}) with empty filter returns ALL documents
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 }); // newest first
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ===== POST /api/students =====
// Inserts a new student document into MongoDB
app.post('/api/students', async (req, res) => {
  try {
    const { name, rollNo, branch, year, email, cgpa } = req.body;

    // Create new document using the Student model
    const student = new Student({ name, rollNo, branch, year, email, cgpa });

    // .save() inserts the document into the MongoDB collection
    await student.save();
    res.status(201).json({ message: 'Student added', student });
  } catch (err) {
    // Handle duplicate rollNo (unique constraint violation)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Roll number already exists!' });
    }
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// ===== DELETE /api/students/:id =====
// Deletes a student by MongoDB _id
app.delete('/api/students/:id', async (req, res) => {
  try {
    // findByIdAndDelete: find document by _id and remove it
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
