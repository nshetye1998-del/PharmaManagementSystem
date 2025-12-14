# PharmaXpert - Pharmacy Management System Documentation

## 1. Project Overview
**PharmaXpert** is a comprehensive Pharmacy Management System designed to streamline the daily operations of a pharmacy. It handles inventory management, point-of-sale (POS) billing, supplier and customer management, and comprehensive sales/purchase reporting.

The system is built using the **MERN Stack** (MongoDB, Express.js, React, Node.js) and is fully containerized using **Docker** for easy deployment.

---

## 2. Architecture

The application follows a standard Client-Server architecture pattern.

```mermaid
graph TD
    User((User))
    Browser[Web Browser / Client]
    Frontend[Frontend (React + Vite)]
    Backend[Backend API (Node.js + Express)]
    DB[(MongoDB Database)]

    User -->|Interacts| Browser
    Browser -->|Serves UI| Frontend
    Frontend -->|HTTP Requests / JSON| Backend
    Backend -->|Mongoose Queries| DB
    DB -->|Data| Backend
    Backend -->|JSON Response| Frontend

    subgraph Docker_Env ["Docker Containers"]
        Frontend
        Backend
        DB
    end
```

### Data Flow
1.  **Authentication**: Users (Admin or Counter/Cashier) log in via the Frontend.
2.  **Request Handling**: The Frontend sends HTTP requests (GET, POST, PUT, DELETE) to the Backend via the `/pharmacy` API prefix.
3.  **Processing**: The Express Backend validates requests, applies business logic (e.g., stock reduction on sale), and interacts with MongoDB.
4.  **Persistence**: Data is stored in MongoDB collections (`users`, `drugs`, `invoices`, etc.).

---

## 3. Technology Stack

### Frontend
*   **Framework**: React.js
*   **Build Tool**: Vite
*   **Routing**: React Router DOM
*   **HTTP Client**: Axios
*   **Styling**: Vanilla CSS
*   **Utils**: jsPDF (Invoice generation), QRCode.react

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB
*   **ODM**: Mongoose
*   **Authentication**: JWT, bcryptjs
*   **Environment**: Dotenv

### DevOps
*   **Containerization**: Docker
*   **Orchestration**: Docker Compose

---

## 4. Key Features

### 🏢 Admin Dashboard
*   **Inventory Management**: Add, update, delete drugs. Track expiry dates.
*   **Company Management**: Manage pharmaceutical suppliers/companies.
*   **Reports**: View Sales Reports, Purchase Reports, and History Reports.
*   **User Management**: Create Counter/Cashier accounts.

### 🛒 Point of Sale (Counter)
*   **Fast Billing**: Barcode-based item entry.
*   **Auto-Calculation**: Automatic tax and total calculation.
*   **Validations**: Prevents selling expired items or insufficient stock.
*   **Invoice Generation**: Generates PDF invoices with QR codes.
*   **Real-time Updates**: Reflects changes in "Today's Orders" immediately.

---

## 5. Project Structure

```
pharma/
├── Backend/                 # Node.js API Server
│   ├── config/              # DB Connection
│   ├── controllers/         # Logic for API endpoints
│   ├── models/              # Mongoose Schemas (User, Drug, Invoice, etc.)
│   ├── routes/              # API Route definitions
│   ├── server.js            # Entry point
│   ├── Dockerfile           # Backend Container Config
│   └── docker_seed.js       # Database Seeding Script
│
├── Frontend/                # React Vite Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # View pages (Counter, Dashboard, Admin)
│   │   ├── App.jsx          # Main Router
│   │   └── main.jsx         # Entry point
│   └── Dockerfile           # Frontend Container Config
│
├── docker-compose.yml       # Docker orchestration
└── package.json             # Root orchestrator (concurrently)
```

---

## 6. Installation & Setup

### Method A: Docker (Recommended)
This runs the full stack (Frontend, Backend, Database) in isolated containers.

**Prerequisites**: Docker Desktop installed.

1.  **Start Services**:
    ```bash
    docker-compose up --build
    ```
2.  **Initialize Database** (First time only):
    In a new terminal window, run:
    ```bash
    docker-compose exec backend npm run seed
    ```
3.  **Access the App**:
    *   Frontend: [http://localhost:5173](http://localhost:5173)
    *   Backend: [http://localhost:8000](http://localhost:8000)

### Method B: Manual / Local Dev
**Prerequisites**: Node.js (v18+) and MongoDB Local Server installed and running.

1.  **Install Dependencies**:
    ```bash
    npm install
    cd Backend && npm install
    cd ../Frontend && npm install
    ```
2.  **Environment Variables**:
    *   Ensure `Backend/.env` has `MONGO_URI` and `PORT`.
    *   Ensure `Frontend/.env` has `VITE_API_BASE_URL`.
3.  **Seed Database**:
    ```bash
    cd Backend && node docker_seed.js
    ```
4.  **Run Application**:
    From the root directory:
    ```bash
    npm start
    ```

---

## 7. Default Credentials

The seeding script creates the following default users:

| Role | Username / ID | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `Pharma` | `pharma123` | Full Dashboard Access |
| **Counter/Cashier** | `counter1` | `1234` | POS & Billing Only |

---

## 8. API Endpoints (Summary)

The backend exposes RESTful APIs at `http://localhost:8000/pharmacy`.

*   **Auth**: `/counter/login`
*   **Drugs**: `/drug/add`, `/drug/all`, `/drug/update`, `/drug/delete`
*   **Invoice**: `/invoice/add`, `/invoice/get/all`
*   **Companies**: `/companies/add`, `/companies/all`
*   **Sales/Purchases**: `/sale/all`, `/purchase/all`
