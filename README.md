# FSDL Final Mock Practical — All Solutions
## Gauri Patil | B.E. Computer Engineering | PCCOE Pune

---

## 📁 Folder Structure

```
fsdl/
├── ui_dom/               ← Section 1: UI + DOM + Interactivity (Q1–Q10)
├── logic_js/             ← Section 2: Logic-Based JavaScript (Q11–Q18)
├── html_css/             ← Section 3: HTML + CSS Design (Q19–Q24)
├── data_viz/             ← Section 4: Data Visualization (Q25–Q28)
└── backend/              ← Section 5: Backend/Database (Q29–Q30)
```

---

## 🌐 Section 1: UI + DOM + Interactivity
| # | File | Concepts Covered |
|---|------|-----------------|
| Q1 | Digital_Glossary.html | Table, Search Filter, DOM |
| Q2 | Skill_Bar_Component.html | Reusable Components, CSS Transitions |
| Q3 | Pricing_Toggle_Interface.html | Toggle Switch, data-* attributes |
| Q4 | RealTime_Profile_Previewer.html | oninput event, Live DOM Update |
| Q5 | Theme_Switcher.html | localStorage, CSS Variables |
| Q6 | Product_Gallery.html | JSON, Dynamic Cards, Cart |
| Q7 | Responsive_Navigation_Bar.html | Flexbox Nav, Dropdown, Hamburger |
| Q8 | Photo_Gallery.html | CSS Hover, Zoom, Overlay |
| Q9 | DragAndDrop_List.html | HTML5 Drag & Drop API |
| Q10 | FAQ_Accordion.html | max-height Accordion Animation |

## ⚡ Section 2: Logic-Based JavaScript
| # | File | Concepts Covered |
|---|------|-----------------|
| Q11 | Shopping_Cart_System.html | Cart State, CRUD, Total Calc |
| Q12 | Basic_Calculator.html | Arithmetic, State, Keyboard Support |
| Q13 | ToDo_List_Application.html | Array CRUD, Filter, DOM |
| Q14 | String_Operations.html | String Methods: reverse, toUpperCase, etc |
| Q15 | Stopwatch_Application.html | setInterval, Date.now(), Timing |
| Q16 | Quiz_Application.html | Multi-step UI, Scoring, Review |
| Q17 | Product_Filtering_System.html | Dynamic Filter, Array.filter() |
| Q18 | Notes_Application.html | localStorage CRUD, Search |

## 🎨 Section 3: HTML + CSS Design
| # | File | Concepts Covered |
|---|------|-----------------|
| Q19 | Structured_Resume_Webpage.html | Semantic HTML, Grid Layout |
| Q20 | Student_Registration_Form.html | Form Elements, Validation |
| Q21 | Weekly_Timetable.html | rowspan, colspan in Tables |
| Q22 | Blog_Layout.html | Header, Sidebar, Content, Footer |
| Q23 | Personal_Portfolio_Webpage.html | Single Page, Sections, Sticky Nav |
| Q24 | Image_Gallery_Category_Filtering.html | CSS Columns, JS Filter |

## 📊 Section 4: Data Visualization
| # | File | Concepts Covered |
|---|------|-----------------|
| Q25 | Bar_Chart_Department_Students.html | Chart.js Bar Chart |
| Q26 | Pie_Doughnut_Chart_Attendance.html | Chart.js Pie + Doughnut |
| Q27 | Weather_Dashboard.html | Line + Bar + Pie, Multi-chart |
| Q28 | Student_Performance_Dashboard.html | Multiple Charts, Dynamic Switch |

## 🗄 Section 5: Backend / Database
| # | File | Concepts Covered |
|---|------|-----------------|
| Q29 | Student_Record_Management_System.js | Node.js, Express, MongoDB, CRUD |
| Q30 | Event_Registration_System.js | REST API, Mongoose Schema, Filter |

---

## 🚀 How to Run Backend Files (Q29, Q30)

### Prerequisites
1. Install [Node.js](https://nodejs.org)
2. Install [MongoDB Community](https://www.mongodb.com/try/download/community)

### Steps
```bash
# 1. Navigate to backend folder
cd backend/

# 2. Install dependencies
npm install express mongoose

# 3. Start MongoDB (in a separate terminal)
mongod

# 4. Run Student Record System
node Student_Record_Management_System.js
# Open: http://localhost:3000

# 5. Run Event Registration System
node Event_Registration_System.js
# Open: http://localhost:3001
```

---

## 📌 Key Viva Topics

| Topic | Where Used |
|-------|-----------|
| localStorage | Q5 (Theme), Q18 (Notes) |
| DOM Manipulation | Q1–Q10, Q11–Q18 |
| JSON | Q6, Q11, Q17 |
| CSS Grid/Flexbox | Q7, Q19, Q22 |
| rowspan / colspan | Q21 |
| Chart.js | Q25–Q28 |
| Drag & Drop API | Q9 |
| setInterval / clearInterval | Q15 |
| Mongoose Schema & Model | Q29, Q30 |
| REST API (GET, POST, DELETE) | Q29, Q30 |
| MongoDB CRUD | Q29, Q30 |
| Array methods (.filter, .map, .find) | Q11–Q18 |

---

*All files are standalone HTML (open directly in browser) except Q29 & Q30 which need Node.js.*
