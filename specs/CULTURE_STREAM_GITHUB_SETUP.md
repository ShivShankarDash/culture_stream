# Culture Stream - GitHub Repo Setup

## 🚀 How to Create the Repo

### Step 1: Create on GitHub
1. Go to https://github.com/new
2. Name: `culture_stream`
3. Description: "Real-time behavioral monitoring for organizational culture"
4. Make it **PUBLIC** (judges need to see it)
5. Add `.gitignore` template: **Node**
6. Add license: **MIT**
7. Click **Create Repository**

### Step 2: Clone Locally
```bash
cd ~/Projects  # or wherever you keep repos
git clone https://github.com/YOUR_USERNAME/culture_stream.git
cd culture_stream
```

### Step 3: Set Up Initial Structure
```bash
# Create folders
mkdir -p backend/src/{data,metrics,mutations,api} backend/tests
mkdir -p frontend/public frontend/src
mkdir -p docs

# Create files
touch backend/package.json backend/src/index.js
touch frontend/package.json frontend/public/index.html
touch docs/ARCHITECTURE.md
touch .gitignore README.md
```

---

## 📁 Initial Directory Structure

```
culture_stream/
├── README.md                    # Main overview (use CULTURE_STREAM_README_TEMPLATE.md)
├── .gitignore                   # Node gitignore
├── .github/
│   └── CODEOWNERS              # Team assignments (optional)
│
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js            # Express server
│   │   ├── data/
│   │   │   ├── messageGenerator.js
│   │   │   ├── orgConfig.json
│   │   │   └── messageTemplates.json
│   │   ├── metrics/
│   │   │   └── metricsCalculator.js
│   │   ├── mutations/
│   │   │   ├── mutationDetector.js
│   │   │   └── mutationRules.json
│   │   └── api/
│   │       ├── routes.js
│   │       ├── controllers.js
│   │       └── middleware.js
│   └── tests/
│       ├── data.test.js
│       ├── metrics.test.js
│       └── mutations.test.js
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   ├── index.html
│   │   └── styles.css
│   └── src/
│       ├── app.js
│       ├── rope-animation.js
│       ├── metrics-display.js
│       ├── diagnostic-box.js
│       └── api-client.js
│
└── docs/
    ├── ARCHITECTURE.md         # Technical spec
    ├── JUDGE_FAQ.md            # Q&A preparation
    ├── DATA_SCHEMA.md          # Message format
    ├── PRODUCT_FLOW.md         # User journey
    └── API.md                  # API documentation
```

---

## 📝 Initial Files to Create

### `.gitignore`
```
node_modules/
.DS_Store
*.log
.env
dist/
build/
.idea/
.vscode/
*.swp
```

### `backend/package.json`
```json
{
  "name": "culture-stream-backend",
  "version": "1.0.0",
  "description": "Culture mutation detection engine",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "keywords": ["culture", "detection", "metrics"],
  "author": "Culture Stream Team",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.0"
  }
}
```

### `frontend/package.json`
```json
{
  "name": "culture-stream-frontend",
  "version": "1.0.0",
  "description": "Culture Stream visualization",
  "main": "public/index.html",
  "scripts": {
    "start": "python3 -m http.server 5555",
    "dev": "python3 -m http.server 5555"
  },
  "keywords": ["visualization", "culture", "rope"],
  "author": "Culture Stream Team",
  "license": "MIT"
}
```

### `backend/src/index.js` (Skeleton)
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// TODO: Import routes
// app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### `frontend/public/index.html` (Skeleton)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Culture Stream</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="container">
    <h1>Culture Stream</h1>
    <canvas id="rope-canvas"></canvas>
    <div id="metrics-display"></div>
    <div id="diagnostic-box"></div>
    <button id="start-btn">Start Simulation</button>
  </div>
  
  <script src="../src/app.js"></script>
</body>
</html>
```

---

## 🔄 Git Workflow (For Your Team)

### Initial Setup (Only Once)

```bash
# Backend dev
git clone https://github.com/YOUR_USERNAME/culture_stream.git
cd culture_stream
git checkout -b backend
npm install
# (code)

# Frontend dev (Shiv)
git clone https://github.com/YOUR_USERNAME/culture_stream.git
cd culture_stream
git checkout -b frontend
npm install
# (code)

# Presenter
git clone https://github.com/YOUR_USERNAME/culture_stream.git
cd culture_stream
git checkout -b docs
# (documentation)
```

### Daily Workflow

```bash
# Before starting work
git pull origin main
git rebase main  # if on feature branch

# Make changes
git add .
git commit -m "feat: add message generator"
git push origin your-branch

# When ready to merge
# Create Pull Request on GitHub
# Get code review (team review each other's work)
# Merge to main
```

### Final Demo (1 hour before)

```bash
# Merge all branches to main
git checkout main
git pull origin main
# Verify everything works locally
npm install (backend)
npm start (both)
# Test demo end-to-end
```

---

## 👥 Add Team Members to Repo

### On GitHub:

1. Go to repo → **Settings** → **Collaborators**
2. Click **Add people**
3. Search for each team member:
   - Backend dev GitHub username
   - Presenter GitHub username
4. Set role: **Maintainer** (everyone should have push access)

### In `.github/CODEOWNERS` (Optional but recommended):

```
# Owner of entire repo
* @your-username

# Backend files
backend/ @backend-dev-username

# Frontend files
frontend/ @your-username

# Documentation
docs/ @presenter-username
```

---

## 📊 Commit Message Convention

Keep commits clear and organized:

```
# Format:
type(scope): description

# Examples:
feat(backend): add message generator for weeks 1-8
feat(frontend): implement rope animation state transitions
fix(backend): correct silos_score calculation
docs(judge-faq): add burnout question answers
test(metrics): add unit tests for sentiment calculation
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `test:` Tests
- `docs:` Documentation
- `chore:` Maintenance

---

## 🚀 Continuous Integration (Optional)

If you want GitHub Actions to run tests automatically:

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd backend && npm install && npm test
```

---

## 📌 First Commit Checklist

Before your first team commits:

- [ ] `.gitignore` is in place
- [ ] `backend/package.json` has all dependencies
- [ ] `frontend/package.json` works
- [ ] `README.md` is filled out (use template)
- [ ] Folder structure matches above
- [ ] All team members are added as collaborators
- [ ] Everyone can clone and run locally

---

## 🔗 Repo Links (For Sharing)

Once created:

- **Main repo:** `https://github.com/YOUR_USERNAME/culture_stream`
- **For judges:** Include this link in pitch materials
- **For documentation:** Link from main `README.md` to `docs/` folder

---

## ✅ Ready to Code?

Once repo is set up:

1. **Backend dev** → Start with `backend/src/data/messageGenerator.js`
2. **Frontend dev (Shiv)** → Start with `frontend/src/rope-animation.js`
3. **Everyone** → Update docs as you go
4. **Daily:** Commit progress, ask questions in this thread

---

## 🎯 Pro Tips

1. **Commit early, commit often** — Don't wait until everything is done
2. **Review each other's code** — Catch bugs before integration
3. **Keep main branch stable** — Only merge tested code
4. **Document as you code** — Future-you (and judges) will thank you
5. **Test locally before pushing** — Don't break the build

---

Ready? Create the repo and send me the link! 🚀
