# 🏫 EMS School - Backend REST API Server

A high-performance, modular, and production-ready School Management System (EMS) REST API built with **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL**, and **Prisma ORM (v7)**.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Key Features & Modules](#-key-features--modules)
- [Tech Stack](#-tech-stack)
- [Database Schema & Architecture](#-database-schema--architecture)
- [Environment Variables Configuration](#-environment-variables-configuration)
- [Installation & Setup](#-installation--setup)
- [API Routes Reference](#-api-routes-reference)
- [Automations & Background Cron Jobs](#-automations--background-cron-jobs)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🏛 Architectural Overview

The backend follows a **Modular Clean Architecture** pattern where each domain entity is encapsulated with its own:
- **Routes (`*.routes.ts`)**: Route definitions, middlewares, and HTTP verb mappings.
- **Controllers (`*.controller.ts`)**: Request extraction, status code mapping, and response dispatch.
- **Services (`*.services.ts`)**: Core business logic and database operations using Prisma.
- **Validations (`*.validation.ts`)**: Zod-based request validation schemas.
- **Interfaces (`*.interface.ts`)**: Strongly-typed TypeScript interfaces.

---

## ✨ Key Features & Modules

1. **🔐 Authentication & RBAC (Role-Based Access Control)**:
   - Secure login with bcrypt password hashing.
   - JWT tokens (AccessToken & RefreshToken) delivered via HTTP-Only cookies.
   - 3 distinct user roles: `ADMIN`, `TEACHER`, `STUDENT`.
   - Automatic Super-Admin Seeder (`adminSeed.ts`) on startup.

2. **👥 User & Identity Management**:
   - Separate profiles for Admin, Teacher, and Student linked to the central `User` identity.
   - Bulk student upload and profile avatar management via Cloudinary.

3. **📅 Automated Attendance System**:
   - Daily cron job runs at 08:00 AM (`0 8 * * *`) initializing daily attendance records.
   - Real-time marking: `PRESENT`, `ABSENT`, `LATE`, `LEAVE`.
   - Check-in (`inTime`) and Check-out (`outTime`) timestamp recording.
   - Comprehensive aggregation reports (Daily, Monthly, and Yearly analytics).

4. **💳 Fees & SSLCommerz Payment Gateway**:
   - Dynamic Fee Category setup (`ADMISSION`, `TUITION`, `EXAM`, `TRANSPORT`, etc.).
   - Online payment processing through SSLCommerz sandbox/live APIs.
   - Automatic payment status synchronization (`PENDING`, `SUCCESS`, `FAILED`, `CANCELED`).

5. **📖 Academic Schedule & Routine**:
   - Multi-period class schedules mapped to days (`MONDAY` - `SATURDAY`).
   - Conflict-free teacher and subject assignments.

6. **📝 Digital Student Diary**:
   - Teachers log class lessons, notes, and homework by period and subject.
   - Students and parents view daily homework instructions in real-time.

7. **📊 Term Exam Results & Grading**:
   - Subject-wise marks submission for `FIRST`, `SECOND`, `THIRD`, and `FINAL` terms.
   - Auto-computed grade letters and performance report cards.

8. **📢 Notice & Announcement Board**:
   - Administrative broadcasts with pinned notice capabilities.

9. **📈 Meta Analytics**:
   - Executive dashboard statistics: active counts, attendance percentages, and fee collections.

---

## 🛠 Tech Stack

| Component | Technology | Version |
| :--- | :--- | :--- |
| **Runtime** | Node.js | >= 18.x |
| **Framework** | Express.js | 5.1.0 |
| **Language** | TypeScript | 5.9.3 |
| **Database** | PostgreSQL | Latest |
| **ORM** | Prisma (Multi-file schema) | 7.4.2 |
| **Auth** | JSON Web Token (JWT), bcryptjs | Latest |
| **Validation** | Zod | 4.1.12 |
| **Cron Scheduling** | node-cron | 4.2.1 |
| **Cloud Storage** | Cloudinary & Multer | Latest |
| **Payment Gateway** | SSLCommerz | Node Integration |
| **Excel Parser** | xlsx | 0.18.5 |

---

## 🗄 Database Schema & Architecture

The database is powered by Prisma 7 multi-file schemas located inside `prisma/schema/`:

```
prisma/schema/
├── schema.prisma        # Datasource and client generator
├── enum.prisma          # UserRole, Classes, Gender, WeekDay, FeeCategory, etc.
├── user.prisma          # Core User auth and credential model
├── admin.prisma         # Admin profile details
├── teacher.prisma       # Teacher profile, designation, and relations
├── student.prisma       # Student profile, roll, class, and subjects
├── class&subject.prisma # Academic Classes and Subjects
├── schedule.prisma      # Class times and routine schedules
├── attendance.prisma    # Daily attendance records
├── fees.prisma          # Fee types, fee payments, and transaction records
├── result.prisma        # Term-wise marks and grades
├── diary.prisma         # Daily classroom lesson diary
└── notice.prisma        # School notices and broadcast board
```

---

## ⚙️ Environment Variables Configuration

Create a `.env` file in the `ems_school_backend/` root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/ems_school_db?schema=public"

# Frontend Origin for CORS
FRONTEND_LINK="http://localhost:3000"

# JWT Secrets
JWT_SECRET="your_super_secret_jwt_key_here"
SALTNUMBER=12

# Cloudinary (Media / Photo Uploads)
CLOUD_NAME="your_cloud_name"
API_KEY="your_api_key"
API_SECRET="your_api_secret"

# SSLCommerz Payment Gateway
STORE_ID="your_ssl_store_id"
STORE_PASS="your_ssl_store_password"
PAYMENT_API="https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
VALIDATION_API="https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
SUCCESS_BACKEND_URL="http://localhost:5000/api/v1/payment/success"
FAIL_BACKEND_URL="http://localhost:5000/api/v1/payment/fail"
CANCEL_BACKEND_URL="http://localhost:5000/api/v1/payment/cancel"
SUCCESS_FRONTEND_URL="http://localhost:3000/payment/success"
FAIL_FRONTEND_URL="http://localhost:3000/payment/fail"
CANCEL_FRONTEND_URL="http://localhost:3000/payment/cancel"

# Default Admin Seeding Credentials
EMAIL="admin@ems.edu.bd"
PASSWORD="AdminPassword123!"
```

---

## 🚀 Installation & Setup

1. **Navigate to the backend directory**:
   ```bash
   cd ems_school_backend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or: npm install / yarn install
   ```

3. **Generate Prisma Client**:
   ```bash
   pnpm prisma generate
   ```

4. **Run Database Migrations**:
   ```bash
   pnpm prisma migrate dev --name init
   ```

5. **Start Development Server**:
   ```bash
   pnpm dev
   ```
   *The server starts listening on `http://localhost:5000`.*

6. **Build for Production**:
   ```bash
   pnpm build
   pnpm start
   ```

---

## 📡 API Routes Reference

Base URL: `/api/v1`

| Module | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/login` | Authenticate user & issue tokens | Public |
| **Auth** | `POST` | `/auth/logout` | Clear cookie session | Authenticated |
| **Auth** | `POST` | `/auth/refresh-token` | Refresh expired access token | Authenticated |
| **Auth** | `POST` | `/auth/change-password` | Change account password | Authenticated |
| **User** | `GET` | `/user/me` | Fetch active user session profile | Authenticated |
| **User** | `POST` | `/user/create-student` | Register student with user login | Admin |
| **User** | `POST` | `/user/create-teacher` | Register teacher with user login | Admin |
| **User** | `POST` | `/user/create-admin` | Register an additional admin | Admin |
| **Attendance** | `GET` | `/attendance` | Fetch attendance with date/class filter | Authenticated |
| **Attendance** | `PATCH` | `/attendance/mark` | Mark individual or bulk attendance | Admin / Teacher |
| **Attendance** | `GET` | `/attendance/student` | Student overview & monthly stats | Authenticated |
| **Attendance** | `GET` | `/attendance/teacher` | Teacher attendance records | Admin / Teacher |
| **Classes** | `GET` | `/class` | List all academic classes | Authenticated |
| **Classes** | `POST` | `/class` | Create new academic class | Admin |
| **Subjects** | `GET` | `/subject` | List subjects by class | Authenticated |
| **Subjects** | `POST` | `/subject` | Add new subject to class | Admin |
| **Schedule** | `GET` | `/schedule` | Get weekly class routines | Authenticated |
| **Schedule** | `POST` | `/schedule` | Create routine entry | Admin |
| **Diary** | `GET` | `/diary` | Fetch daily lesson homework | Authenticated |
| **Diary** | `POST` | `/diary` | Post daily homework entry | Teacher / Admin |
| **Results** | `GET` | `/result` | View student term exam results | Authenticated |
| **Results** | `POST` | `/result` | Submit marks & compute grades | Teacher / Admin |
| **Fees** | `GET` | `/fee/types` | List all fee structures | Authenticated |
| **Fees** | `POST` | `/fee/types` | Create fee type configuration | Admin |
| **Payment** | `POST` | `/payment/init` | Initiate SSLCommerz checkout session | Student / Guardian |
| **Payment** | `POST` | `/payment/success` | IPN webhook for successful payment | Public (SSL) |
| **Notice** | `GET` | `/notice` | Fetch active school notices | Public / Auth |
| **Notice** | `POST` | `/notice` | Publish new notice | Admin |
| **Meta** | `GET` | `/meta` | Retrieve administrative KPI metrics | Admin |

---

## ⏰ Automations & Background Cron Jobs

The server includes automated tasks via `node-cron`:
- **Daily Attendance Initializer**:
  - **Cron Expression**: `0 8 * * *` (Every morning at 08:00 AM)
  - **Action**: Generates pending attendance records for all active students and teachers for the current date, ensuring unrecorded users can be flagged accurately.

---

## 📦 Deployment

### Vercel / Serverless
The repository includes `vercel.json` for serverless deployment:
```json
{
  "version": 2,
  "builds": [{ "src": "src/server.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/server.ts" }]
}
```

### Docker / Linux VPS
```bash
# Build the TypeScript project
pnpm build

# Run the compiled production output
NODE_ENV=production node dist/server.js
```

---

## 📄 License
This project is licensed under the ISC License.
