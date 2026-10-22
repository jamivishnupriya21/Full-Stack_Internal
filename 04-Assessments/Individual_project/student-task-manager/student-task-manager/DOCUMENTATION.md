# Project Documentation: Student Task and Assignment Management System

## 1. Abstract
The Student Task and Assignment Management System is a full-stack web application that helps students organise academic work. Students can add, view, edit, delete, search, filter and complete assignments, and a dashboard shows live statistics such as pending, completed and overdue work, completion percentage and upcoming deadlines. The frontend is built with React and plain CSS. The backend is a REST API built with Node.js and Express that stores data in a local JSON file (`db.json`). The two parts communicate using the Fetch API.

## 2. Problem Statement
Students handle many assignments across subjects, each with different deadlines and priorities. Notes, chat messages and memory are easy to lose or forget, so deadlines are missed. There is a need for a simple, central tool that records every assignment, shows what is overdue or due soon, and shows overall progress.

## 3. Objectives
- Store assignment details (title, subject, description, due date, priority, status) in one place.
- Provide add, view, edit, delete and complete/reopen operations.
- Provide search, filtering and sorting.
- Detect and clearly show overdue assignments.
- Calculate dashboard statistics dynamically from the data.
- Validate input on both the frontend and the backend.
- Provide a responsive, easy-to-use interface.

## 4. Software and Hardware Requirements
**Software:** Windows 10/11, Node.js 20.19+ with npm, VS Code, a modern browser (Chrome, Edge, Firefox). Libraries: React, React DOM, React Router, Vite, Express, CORS.
**Hardware:** any laptop with at least 4 GB RAM (8 GB recommended), 500 MB free disk space, and a dual-core processor or better.

## 5. System Architecture
```
 Browser (React app, port 5173)
   Pages -> Components -> services/api.js
                              |
                              |  HTTP + JSON (Fetch API)
                              v
 Express server (port 5000)
   Routes -> Validation -> File helpers
                              |
                              v
                      backend/db.json
```
It is a three-layer design: presentation (React), application/API (Express), and data (JSON file). The React app never reads `db.json` directly; it always asks the API.

## 6. Module Descriptions
- **Dashboard:** statistic cards, completion ring, pending-by-priority bars, upcoming deadlines, recently added list, overdue alert.
- **All Assignments:** search by title, filter by subject/status/priority, sort by due date, card actions (complete, edit, delete).
- **Add / Edit Assignment:** one form page used for both modes; `/add` creates, `/edit/:id` loads the record from the API and updates it. Required-field validation with readable messages.
- **Upcoming Deadlines:** pending assignments grouped as Overdue, Next 7 days, Later.
- **API service (`api.js`):** one place for all fetch calls and error handling.
- **Helpers (`helpers.js`):** date calculations (`isOverdue`, `daysUntil`) and `getStats`.
- **Backend:** REST routes, validation, safe reading/writing of `db.json`.

## 7. API Endpoints
| Method | Endpoint | Description | Success | Errors |
|---|---|---|---|---|
| GET | /api/assignments | Get all assignments | 200 | 500 |
| GET | /api/assignments/:id | Get one assignment | 200 | 400, 404 |
| POST | /api/assignments | Create assignment | 201 | 400 |
| PUT | /api/assignments/:id | Update assignment (also changes status) | 200 | 400, 404 |
| DELETE | /api/assignments/:id | Delete assignment | 200 | 400, 404 |
| GET | /api/health | Check the server is running | 200 | none |

## 8. How React Communicates with Express
1. When the app starts, `App.jsx` calls `getAssignments()` inside `useEffect`.
2. `api.js` uses `fetch("http://localhost:5000/api/assignments")` and converts the response with `response.json()`.
3. The result is stored with `useState` and passed to pages as props.
4. When the user adds, edits, deletes or completes an assignment, `App.jsx` sends a POST, PUT or DELETE request, then calls `getAssignments()` again so the screen always matches the backend.
5. Failures are handled in three ways: network errors (server off), HTTP errors (400/404/500 with a message from the server), and empty responses. Errors appear as a red message.
6. CORS is enabled on the server because the frontend (port 5173) and backend (port 5000) are different origins.

## 9. How JSON Data Is Read and Updated
- `db.json` holds an array of assignment objects.
- **Read:** `fs.readFile` reads the text and `JSON.parse` converts it to a JavaScript array. If the JSON is broken, the server returns an error instead of overwriting the file.
- **Write:** the array is converted with `JSON.stringify` and saved to a temporary file, which is then renamed to `db.json`. This protects against a half-written file.
- **Queue:** `runExclusive` makes read-change-write steps run one after another so two requests cannot overwrite each other.
- **IDs:** a new ID is the highest existing ID plus one. Update and delete only change the matching record; every other record is kept.
- Because data is stored in a file, changes survive a backend restart.

## 10. Advantages
- Simple to understand and explain: plain CSS, no database server, small codebase.
- Dashboard is calculated from real data, not hardcoded.
- Validation on both sides; clear error and success messages.
- Works offline on a laptop; nothing to pay for.
- Responsive layout for laptop, tablet and phone.
- Safe file writes reduce the risk of data loss.

## 11. Limitations
- No login: one shared list for everyone using the server.
- A JSON file is not suitable for many users or large data.
- Dates use the computer's current date, so overdue status depends on the device clock.
- No reminders or notifications.
- No automated tests.

## 12. Future Enhancements
- User accounts and authentication.
- A real database (MongoDB, MySQL or PostgreSQL).
- Email or browser notifications for upcoming deadlines.
- Calendar view and drag-and-drop.
- File attachments and subtasks.
- Dark mode, charts and exporting to PDF or CSV.
- Automated tests and deployment to a cloud host.

## 13. Conclusion
The project meets the goal of a complete assignment manager: students can record work, see deadlines and track progress through a clean dashboard. It demonstrates a full-stack flow, React frontend, Express REST API and file-based storage, using simple, well-structured code. With a real database and user accounts it could grow into a production tool.

## 14. Viva Questions and Answers

1. **What is your project about?**
   A web app that lets students add, edit, delete, search, filter and complete assignments and see deadlines and progress on a dashboard.

2. **Why did you use React?**
   React builds the interface from reusable components and updates only the parts of the page that change, which suits dashboards and forms.

3. **What is Express.js?**
   A Node.js framework for building web servers and REST APIs with simple routing and middleware.

4. **What is a REST API?**
   A way for two programs to talk over HTTP using URLs and methods: GET to read, POST to create, PUT to update, DELETE to remove, usually exchanging JSON.

5. **How does React communicate with Express?**
   React uses the Fetch API to send HTTP requests to `http://localhost:5000/api/...`, and Express replies with JSON that React stores in state.

6. **What is CORS and why did you enable it?**
   Browsers block requests between different origins by default. React runs on port 5173 and Express on 5000, so the `cors` middleware tells the browser the request is allowed.

7. **Why a JSON file instead of a database?**
   The project requirement is a simple local file. It is easy to understand and needs no installation, though it is not meant for many users.

8. **How is data saved permanently?**
   The server rewrites `db.json` after every create, update or delete, so the data is still there after restarting.

9. **What are `useState` and `useEffect`?**
   `useState` stores data that changes (like the assignment list). `useEffect` runs code at certain moments, such as loading data when the page opens.

10. **What is React Router?**
    A library that shows different pages for different URLs without reloading the browser, for example `/assignments` and `/upcoming`.

11. **How do you identify an overdue assignment?**
    An assignment is overdue when its status is Pending and its due date is earlier than today's date. Completed assignments are never overdue.

12. **How are dashboard statistics calculated?**
    `getStats` in `helpers.js` counts and filters the assignment array: total, completed, pending, overdue, and percent = completed ÷ total × 100.

13. **How does validation work?**
    The form checks that title, subject and due date are filled and shows messages. The backend validates again (and checks the date format, priority and status), returning 400 with error messages if the data is wrong.

14. **How did you use the same page for adding and editing?**
    The routes `/add` and `/edit/:id` both show `AddAssignment`. If an `id` exists in the URL (`useParams`), the page fetches that assignment and fills the form, then sends PUT instead of POST.

15. **What are the limitations and how would you improve the project?**
    There is no login and the JSON file does not scale. I would add user accounts, a real database like MongoDB or MySQL, and deadline notifications.
