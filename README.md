# 🎯 Job Application Tracker

A modern, full-stack web application designed to help job seekers organize, track, and optimize their job application process. Features an intuitive Kanban board, real-time analytics, interview contact logs, and external job discovery integrations.

---

## ✨ Key Features

- **📊 Interactive Analytics Dashboard**: Track response rates, application outcomes by stage, and monthly submission timelines powered by **Recharts**.
- **📋 Kanban Pipeline Board**: Drag-and-drop application pipeline manager (*Saved*, *Applied*, *Interview*, *Offer*, *Rejected*) powered by `@hello-pangea/dnd`.
- **📁 Comprehensive Application Details**: Log salary details, position details, company notes, interview dates, and recruiter contact info.
- **🔍 Live Job Discovery**: Integrated with external job APIs (Arbeitnow & Remotive) to browse and import active job openings directly.
- **⚡ Fast & Responsive UI**: Clean visual design with smooth Framer Motion micro-animations, toast alerts, and dark mode support.
- **☁️ Vercel & MongoDB Ready**: Pre-configured serverless API routing (`/api`) for seamless deployment on Vercel with MongoDB Atlas.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
- **Visuals & Charts**: [Recharts](https://recharts.org/) + [Framer Motion](https://www.framer.com/motion/) + [React Icons](https://react-icons.github.io/react-icons/)
- **Drag & Drop**: `@hello-pangea/dnd`

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose 9](https://mongoosejs.com/)
- **Integrations**: Arbeitnow API & Remotive Job API

---

## 📁 Project Structure

```text
job-application-tracker/
├── api/
│   └── index.js              # Vercel Serverless Function API Entry
├── client/                   # React Frontend (Vite)
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── api/              # Axios configuration
│   │   ├── components/       # UI Components (Board, Forms, Dashboard, Common)
│   │   ├── hooks/            # Custom React Hooks
│   │   ├── pages/            # Page Views (Dashboard, Kanban Board, Discovery, List)
│   │   └── utils/            # Formatters and constants
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                   # Express Backend
│   ├── config/               # Database connection config
│   ├── controllers/          # Route handlers (Applications, Analytics, Sync)
│   ├── models/               # Mongoose Schemas (Application, Analytics)
│   ├── routes/               # API Router endpoints
│   ├── services/             # External API integration & Seeding services
│   ├── server.js             # Express local server entry point
│   └── package.json
├── package.json              # Root build & start scripts
├── vercel.json               # Vercel deployment configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string)

### 1. Local Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/VakaVenkatesh/job-application-tracker.git
cd job-application-tracker
```

Install packages in client and server:

```bash
# Install frontend dependencies
npm install --prefix client

# Install backend dependencies
npm install --prefix server
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory (or use `server/.env`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job-tracker
NODE_ENV=development
```

### 3. Run Locally

Start the development server:

```bash
# Run backend (Express)
npm run dev --prefix server

# Run frontend (Vite) in a new terminal window
npm run dev --prefix client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploying on Vercel

This repository is optimized for one-click deployment on **Vercel** with automatic serverless routing for backend API endpoints.

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Push your repository to **GitHub**:
   ```bash
   git add .
   git commit -m "Configure Vercel deployment and documentation"
   git push -u origin main
   ```

2. Go to the [Vercel Dashboard](https://vercel.com/new) and click **Import Project**.
3. Select your **`job-application-tracker`** GitHub repository.
4. Configure Build & Output Settings:
   - **Framework Preset**: `Vite` (or `Other`)
   - **Root Directory**: `./` (Leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
5. Add Environment Variables under **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/job-tracker?retryWrites=true&w=majority`)
6. Click **Deploy**.

---

### Option B: Deploy via Vercel CLI

1. Install the Vercel CLI globally (or run via `npx`):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

4. Set the `MONGODB_URI` environment variable when prompted or via the Vercel CLI:
   ```bash
   vercel env add MONGODB_URI
   ```

---

## 🚀 Deploying on Render

This project includes a [`render.yaml`](file:///e:/Job%20Application%20Tracker/render.yaml) blueprint file for easy deployment as a full-stack **Web Service** on [Render.com](https://render.com/).

### Option A: Via Render Blueprints (Automatic)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint**.
2. Connect your **`job-application-tracker`** GitHub repository.
3. Render will auto-detect `render.yaml` and configure the Web Service automatically:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Enter your **`MONGODB_URI`** connection string when prompted.
5. Click **Apply**.

### Option B: Via Render Web Service (Manual)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `job-application-tracker`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variables under **Environment Variables**:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `NODE_ENV`: `production`
5. Click **Create Web Service**.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status health check |
| `GET` | `/api/applications` | Get all job applications (supports search, filter, sort) |
| `POST` | `/api/applications` | Create a new job application |
| `GET` | `/api/applications/:id` | Get application by ID |
| `PUT` | `/api/applications/:id` | Update application details or stage |
| `DELETE` | `/api/applications/:id` | Delete application |
| `GET` | `/api/analytics` | Retrieve metrics, stage breakdown, and response rates |
| `GET` | `/api/sync/jobs` | Fetch live remote jobs from Arbeitnow & Remotive APIs |
| `POST` | `/api/sync/import` | Import selected external job opening into tracker |

---

## 📄 License

This project is licensed under the MIT License.
