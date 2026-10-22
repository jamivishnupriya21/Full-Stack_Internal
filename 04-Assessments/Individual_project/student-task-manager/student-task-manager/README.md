# Student Task and Assignment Management System

A full-stack web app to organise assignments, track deadlines, set priorities and monitor progress.

**Stack:** React (JSX) + Vite, React Router, plain CSS, Node.js, Express.js, `backend/db.json` as the database, Fetch API.

## How to run (Windows, VS Code)

You need Node.js 20.19+ (check with `node -v`). Use `npm.cmd` instead of `npm` to avoid the PowerShell `npm.ps1` error.

### Option A: double-click
1. Double-click `setup.bat` (installs packages in both folders, only needed once).
2. Double-click `start.bat` (opens the backend, the frontend, and the browser).

### Option B: VS Code terminals
Open the `student-task-manager` folder in VS Code, then use two terminals.

Terminal 1 (backend):
```powershell
cd backend
npm.cmd install
npm.cmd run dev
```
Terminal 2 (frontend):
```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```
Open http://localhost:5173 in the browser. The backend runs at http://localhost:5000.

## Folder structure
```
student-task-manager/
├── setup.bat / start.bat        Windows helper scripts
├── DOCUMENTATION.md             Report text + 15 viva questions
├── backend/
│   ├── server.js                Express API, validation, db.json read/write
│   ├── db.json                  Sample data (11 assignments)
│   └── package.json
└── frontend/
    ├── index.html               Page React renders into
    ├── package.json
    └── src/
        ├── main.jsx             Starts React + BrowserRouter
        ├── App.jsx              Layout, routes, shared state, API actions
        ├── index.css            All styling (plain CSS, responsive)
        ├── services/api.js      Every fetch call to the backend
        ├── utils/helpers.js     Date helpers + dashboard statistics
        ├── components/
        │   ├── Sidebar.jsx          Navigation (off-canvas on mobile)
        │   ├── Header.jsx           Page title + Add Assignment button
        │   ├── StatCard.jsx         Dashboard summary card
        │   ├── AssignmentCard.jsx   One assignment with actions
        │   ├── AssignmentList.jsx   Grid of cards + empty state
        │   ├── AssignmentForm.jsx   Add/edit form with validation
        │   ├── Toast.jsx            Success/error messages
        │   └── ConfirmModal.jsx     Delete confirmation
        └── pages/
            ├── Dashboard.jsx        Stats, progress, upcoming, recent
            ├── AllAssignments.jsx   Search, filters, sorting
            ├── AddAssignment.jsx    Add mode (/add) and edit mode (/edit/:id)
            └── UpcomingDeadlines.jsx Overdue / next 7 days / later
```

Routes: `/` Dashboard, `/assignments`, `/add`, `/edit/:id`, `/upcoming`.

## API
| Method | URL | Purpose |
|---|---|---|
| GET | /api/assignments | all assignments |
| GET | /api/assignments/:id | one assignment |
| POST | /api/assignments | create |
| PUT | /api/assignments/:id | update (also used for Pending/Completed) |
| DELETE | /api/assignments/:id | delete |

## Testing checklist
Dates in `db.json` are fixed. On **15 Oct 2026** the dashboard should show:
Total **11**, Pending **7**, Completed **4**, Overdue **2** (ER Diagram, Process Scheduling), Completion **36%**.
On other days the overdue/upcoming numbers change because they depend on today's date. Edit the dates in `db.json` to re-test.

1. **Dashboard:** open `/`; cards, progress ring, upcoming and recent lists appear.
2. **Add:** click Add Assignment, submit empty (see 3 red messages), then fill title/subject/date and save. A green message appears and it shows in All Assignments.
3. **Edit:** click Edit on a card, change the title, Save Changes.
4. **Status:** click Mark Completed, then Mark Pending. Dashboard counts change.
5. **Delete:** click Delete, a confirmation box appears; Cancel keeps it, Yes deletes it.
6. **Search/filters:** type part of a title; filter by subject, status (including Overdue), priority; sort earliest/latest; Clear filters.
7. **Overdue:** pending items with a past date show a red "Overdue" badge, red border and "Overdue by N days".
8. **Persistence:** make a change, open `backend/db.json` (it changed), stop and restart the backend, refresh the browser (change is still there).
9. **Navigation:** click all four sidebar links; try `/edit/999` and `/nothing` for the error pages.
10. **Responsive:** press F12, toggle the device toolbar, try a phone width. The sidebar becomes a ☰ menu and cards stack in one column.
11. **Errors:** stop the backend and refresh. A "Could not load assignments" box with Try again appears. Check the browser console (F12) and both terminals for red errors.

## Troubleshooting
- `npm.ps1 cannot be loaded`: use `npm.cmd`, or run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.
- Port 5000 or 5173 in use: close the other program using it.
- "Cannot reach the server": the backend is not running.
- `db.json contains invalid JSON`: you edited the file and broke the syntax. Fix it in VS Code.
