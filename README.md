# 🚀 Professional CRM System

A high-fidelity, full-stack Customer Relationship Management (CRM) platform built with **Flask** and **React**. Designed with a premium, corporate light-mode aesthetic and packed with data-driven features for managing leads, customers, and business analytics.

![Dashboard Preview](frontend/public/assets/login_bg.png) *Note: Replace with your actual dashboard screenshot*

## ✨ Key Features

*   **📊 Advanced Dashboard**: Real-time KPI cards (Total Customers, Leads, Open Leads, Interactions) with trend indicators and interactive doughnut charts.
*   **🎯 Lead Management**: Full CRUD operations for lead tracking with status-colored badges (New, Qualified, Proposal, etc.) and user assignment.
*   **👥 Customer Profiles**: Centralized database with global search, paginated tables, and deep-link interaction history.
*   **💬 Interaction Tracking**: Log every call, email, and meeting with specific badges and detailed descriptions.
*   **📈 Reports & Analytics**: Dynamic sales pipeline funnels, conversion rate calculations, and leads-over-time trend lines.
*   **🔐 Secure Authentication**: JWT-based login and signup with a professional 50/50 split-screen layout and password visibility toggles.
*   **⚙️ Profile & Settings**: Self-service profile management and security (password) updates.
*   **🔔 Notifications**: Integrated activity feed for lead assignments and deal closures.

## 🛠️ Tech Stack

*   **Backend**: Python, Flask, SQLAlchemy (SQLite), JWT, Flask-Bcrypt.
*   **Frontend**: React (Vite), Lucide Icons, Chart.js, Vanilla CSS.
*   **Assets**: Dynamic UI-Avatars, Custom Flat Illustrations.

## 🚀 Getting Started

### Prerequisites
*   Python 3.8+
*   Node.js 16+
*   npm

### Backend Setup
1. Navigate to the `backend/` directory.
2. Install dependencies:
   ```bash
   pip install flask flask_sqlalchemy flask_cors flask_bcrypt pyjwt
   ```
3. Initialize the database and run the server:
   ```bash
   python app.py
   ```
   *The backend will run on `http://127.0.0.1:5000`*

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the production bundle:
   ```bash
   npm run build
   ```
   *The Flask backend will serve the bundled React app automatically.*

## 📂 Project Structure

```
CRMProject/
├── backend/
│   ├── app.py          # Main entry point & Flask config
│   ├── routes.py       # API endpoints & Business logic
│   ├── models.py       # Database schema
│   └── database.db     # SQLite Database
├── frontend/
│   ├── src/
│   │   ├── pages/      # 10+ Professional Interfaces
│   │   ├── services/   # Axios API integration
│   │   └── index.css   # Main design system
│   ├── dist/           # Bundled assets (served by Flask)
│   └── package.json
└── README.md
```

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ for professional lead management.*
