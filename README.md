# 📄 ResumeAI — Resume Analyzer System

A full-stack web application that lets users upload PDF resumes and automatically extracts:
- 📧 Email address
- 📞 Phone number
- 🛠️ Technical skills
- 📃 Full extracted text

---

## 🗂️ Project Structure

```
resume-analyzer/
├── client/                  ← React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── api/             ← Axios configuration
│   │   ├── components/      ← Reusable UI components (Navbar)
│   │   ├── context/         ← Auth context (global state)
│   │   ├── pages/           ← UploadPage, LoginPage, RegisterPage, HistoryPage
│   │   ├── App.jsx          ← Router + route definitions
│   │   ├── main.jsx         ← React entry point
│   │   └── index.css        ← Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                  ← Node.js + Express backend
│   ├── models/              ← Mongoose schemas (User, Resume)
│   ├── routes/              ← API routes (auth, resume)
│   ├── middleware/          ← JWT auth middleware
│   ├── uploads/             ← Temp folder (files auto-deleted after parse)
│   ├── index.js             ← Express app entry point
│   ├── .env.example         ← Environment variable template
│   └── package.json
│
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| MongoDB | v6+ | https://www.mongodb.com/try/download/community |
| npm | v9+ | Comes with Node.js |

---

## 🚀 Setup Instructions

### Step 1 — Clone / Extract the project

```bash
cd resume-analyzer
```

---

### Step 2 — Set up the Backend (Server)

```bash
# Navigate to server folder
cd server

# Install all dependencies
npm install

# Copy the example .env file
cp .env.example .env
```

Open `server/.env` and configure:

```env
MONGO_URI=mongodb://localhost:27017/resume_analyzer
JWT_SECRET=replace_this_with_a_long_random_secret_string
PORT=5000
```

> ⚠️ Make sure MongoDB is running locally before starting the server!
> On Mac/Linux: `mongod --dbpath /usr/local/var/mongodb`
> On Windows: Start the MongoDB service from Services panel

```bash
# Start the backend server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Set up the Frontend (Client)

Open a **new terminal tab/window**:

```bash
# Navigate to client folder
cd client

# Install all dependencies
npm install

# Start the frontend dev server
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

### Step 4 — Open the App

Visit **http://localhost:3000** in your browser.

1. **Register** a new account (or use Login)
2. **Upload** a PDF resume on the main page
3. View extracted **email, phone, and skills**
4. Check **History** to see all past analyses

---

## 🔌 API Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new account | `{ name, email, password }` |
| POST | `/api/auth/login` | Login | `{ email, password }` |

### Resume Routes (`/api/resume`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/resume/upload` | No | Upload & analyze PDF |
| GET | `/api/resume/history` | Yes (JWT) | Get user's past resumes |

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- React Router v6
- Axios (HTTP client)
- Tailwind CSS (styling)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Multer (file uploads)
- pdf-parse (PDF text extraction)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- dotenv (environment variables)
- cors (cross-origin requests)

---

## 🔒 Security Notes

- Passwords are **bcrypt hashed** before storage
- JWTs expire after **7 days**
- Uploaded PDF files are **deleted immediately** after parsing
- File size is limited to **5MB**
- Only **PDF** files are accepted

---

## 🐛 Troubleshooting

**"MongoDB connection failed"**
→ Make sure MongoDB is running locally on port 27017

**"Only PDF files are allowed"**
→ Make sure you're uploading a `.pdf` file, not `.doc` or `.docx`

**"Network Error" or CORS issues**
→ Make sure the backend is running on port 5000 and frontend on port 3000

**Skills showing as empty**
→ The skill list matches against known tech keywords. Very specialized resumes may show fewer results.

---

## 📁 Environment Variables

### Server (`server/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/resume_analyzer` |
| `JWT_SECRET` | Secret key for signing JWTs | *(required)* |
| `PORT` | Server port | `5000` |

### Client (`client/.env`) — Optional
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend URL | `http://localhost:5000` |
