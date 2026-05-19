# FlowCRM — Business Automation CRM

A modern full-stack SaaS CRM built with **React + Tailwind CSS** (frontend) and **Spring Boot** (backend).

---

## Frontend Setup (React)

```bash
npm install
npm start         # http://localhost:3000
npm run build     # production build
```

### Folder Structure

```
src/
├── App.js
├── context/AuthContext.js          # JWT auth + user state
├── data/mockData.js                # Seed data
├── services/
│   ├── leadService.js
│   ├── taskService.js
│   └── userService.js
└── components/
    ├── auth/      LoginPage, SignupPage, ProtectedRoute
    ├── layout/    Layout, Sidebar, Navbar
    ├── dashboard/ Dashboard, RevenueChart, LeadStatusChart, RecentActivity
    ├── leads/     LeadsPage, LeadForm
    ├── tasks/     TasksPage, TaskForm
    ├── admin/     AdminPanel
    └── ui/        Button, Card, Badge, Input, Modal
```

---

## Backend Setup (Spring Boot)

### Prerequisites
- Java 17+, Maven 3.8+, PostgreSQL 14+

### Database
```bash
psql -U postgres -f backend/schema.sql
```

### Run
```bash
cd backend && mvn spring-boot:run    # http://localhost:8080
```

### Backend Structure
```
com/flowcrm/
├── FlowCrmApplication.java
├── config/SecurityConfig.java
├── controller/  AuthController, LeadController, TaskController
├── dto/         AuthDto, LeadDto, TaskDto
├── entity/      User, Lead, Task
├── exception/   GlobalExceptionHandler, ResourceNotFoundException, BadRequestException
├── repository/  UserRepository, LeadRepository, TaskRepository
├── security/    JwtUtils, JwtAuthFilter
└── service/     AuthService, LeadService, TaskService, UserDetailsServiceImpl
```

---

## API Endpoints

### Auth (no JWT required)
```
POST  /api/auth/login     { email, password }
POST  /api/auth/signup    { name, email, password }
```

### Leads (JWT required)
```
GET    /api/leads            Get all / search with ?q=
GET    /api/leads/{id}
POST   /api/leads
PUT    /api/leads/{id}
DELETE /api/leads/{id}
```

### Tasks (JWT required)
```
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
```

---

## Connecting Frontend to Real Backend

Replace mock services with real axios calls:

```js
// src/services/leadService.js
import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('crm_token');
  if (token) cfg.headers.Authorization = `Bearer ${JSON.parse(atob(token)).token}`;
  return cfg;
});
export const leadService = {
  getAll: () => api.get('/api/leads').then(r => r.data),
  create: (data) => api.post('/api/leads', data).then(r => r.data),
  update: (id, data) => api.put(`/api/leads/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/api/leads/${id}`),
};
```

Set in `.env`:
```
REACT_APP_API_URL=http://localhost:8080
```

---

## Deployment

### Frontend → Vercel
1. Push to GitHub
2. Import on [vercel.com](https://vercel.com) — `vercel.json` handles SPA routing
3. Set env: `REACT_APP_API_URL=https://your-backend.onrender.com`

### Backend → Render
1. New **Web Service** on [render.com](https://render.com)
2. Build: `mvn clean install -DskipTests`
3. Start: `java -jar target/flowcrm-backend-1.0.0.jar`
4. Add env vars: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`

---

## Features

- **JWT Auth** — Login, signup, role-based routes (Admin/User)
- **Dashboard** — Stats, area chart, pie chart, activity feed, pipeline bars
- **Lead Management** — CRUD, search, filter by status, assign to user
- **Task Management** — CRUD, priority, checkbox status toggle, overdue detection
- **Admin Panel** — User management, bar chart analytics, activity logs
- **Fully Responsive** — Collapsible sidebar, works on all screen sizes
- **Toast Notifications** — Every action gives instant feedback
