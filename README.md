# Full-Stack MERN YouTube Clone

A responsive full-stack YouTube clone built using MongoDB, Express.js, React (Vite), and Node.js (MERN stack) with strict ES Module architecture.

* **GitHub Repository:** [https://github.com/Tteokb/youtube-clone-mern](https://github.com/Tteokb/youtube-clone-mern)
* **Demo Video Walkthrough:** [https://drive.google.com/file/d/18sLqu3qCyPMbw1zYDV3BuEuDEbH_W5pV/view?usp=sharing](https://drive.google.com/file/d/18sLqu3qCyPMbw1zYDV3BuEuDEbH_W5pV/view?usp=sharing)

---

## Demo Credentials

The database is pre-seeded with an active user account and sample data:

* **Email:** `john@example.com`
* **Password:** `password123`
* **Username:** `JohnDoe`
* **Associated Channel:** `Code with John`

You can log in directly using these credentials or create a new user via the Sign-In / Register page.

---

## Features & Implementation Overview

### Frontend (React + Vite)
* **Home Page UI/UX:** Sticky YouTube header with dynamic logo, title search bar, hamburger toggle for the sidebar, and a 7-button category pill bar (`All`, `Web Development`, `JavaScript`, `Data Structures`, `Gaming`, `Music`, `Podcasts`).
* **Responsive Video Grid:** Automatically adjusts across mobile, tablet, and desktop views showing thumbnails, video title, channel name, and view count.
* **User Authentication:** Sign-in and registration views with input validation. After registration, users are automatically directed to log in. Successful login stores the JWT and updates the header with the active username.
* **Video Player Page:** Embedded player, dynamic view counter, real-time Like and Dislike toggle buttons, and complete Comment CRUD (Add, Read, Inline Edit, and Delete).
* **Channel Management:** Displays channel banner, avatar, subscriber count, and uploaded videos. Authenticated channel owners can upload new videos via modal or delete existing videos directly.
* **Search & Filter Pipeline:** Live title query filtering and category-based filtering against backend MongoDB endpoints.

### Backend (Node.js + Express + MongoDB)
* **ES Modules:** Built strictly with modern ES Modules (`import`/`export`).
* **Authentication & JWT:** Secure password hashing using `bcryptjs` and route protection with JSON Web Tokens (JWT).
* **Database Modeling:** Relational Mongoose collections for `User`, `Channel`, `Video`, and `Comment` with cross-referenced ObjectIds.
* **Data Seeding:** Includes an automated seed script (`seed.js`) to populate mock users, channels, and videos across 6+ categories.

---

## Tech Stack

* **Frontend:** React 18, Vite, React Router DOM, Axios, Lucide React
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js, CORS, Dotenv
* **Database:** MongoDB (Atlas / Mongoose ODM)
* **Architecture:** ES Modules (`type: module`)

---

## Project Structure

```text
youtube-clone/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Header, Sidebar
│   │   ├── context/            # AuthContext (JWT & state management)
│   │   ├── pages/              # Home, WatchPage, ChannelPage, AuthPage
│   │   ├── services/           # Axios instance & token interceptors
│   │   ├── App.jsx             # Route configurations
│   │   ├── main.jsx            # Providers and React DOM root
│   │   └── index.css           # Global layout & dark-theme styles
│   └── package.json
├── server/                     # Node.js + Express Backend
│   ├── config/                 # MongoDB connection logic
│   ├── controllers/            # Auth, Video, Channel, Comment controllers
│   ├── middleware/             # JWT auth verification middleware
│   ├── models/                 # User, Channel, Video, Comment schemas
│   ├── routes/                 # Express API routes
│   ├── seed.js                 # Database seeding script
│   ├── index.js                # Express app entry point
│   └── package.json
├── .gitignore
└── README.md