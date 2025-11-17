# 🚀 Workspace Booking Platform

A **full-stack workspace booking platform** built with **React**, **Node.js/Express**, **MongoDB**, and **JWT authentication**.  
Users can signup, login, book rooms, and view their bookings. Admins can seed rooms, view analytics, and manage bookings.

---

## 📦 Project Setup

### 1️⃣ Clone the repository
git clone <repo_url>
cd <repo_folder>

2️⃣ Install dependencies
Backend:
cd backend
npm install

Frontend:
cd frontend
npm install

3️⃣ Set environment variables
Backend (backend/.env):
PORT=4000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
Frontend (frontend/.env):
VITE_API_BASE=http://localhost:4000

4️⃣ Run the application
Backend:
cd backend
npm run dev

Frontend:
cd frontend
npm run dev
Visit http://localhost:5173 (Vite default) to use the frontend.

⚡ API Samples
1️⃣ Signup
http
Copy code
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user"  // or "admin"
}
2️⃣ Login
http
Copy code
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
3️⃣ Get Rooms
GET /api/rooms/
Authorization: Bearer <token>

4️⃣ Post Booking
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "roomId": "<room_id>",
  "startTime": "2025-11-17T10:00:00Z",
  "endTime": "2025-11-17T12:00:00Z"
}
5️⃣ List My Bookings
GET /api/bookings/ListBookingBasedOnId
Authorization: Bearer <token>

6️⃣ Cancel Booking
POST /api/bookings/<booking_id>/cancel
Authorization: Bearer <token>

7️⃣ Analytics (Admin only)

GET /api/bookings/analytics?from=2025-11-01&to=2025-11-30
Authorization: Bearer <token>

🌐 Deployment
Backend: <deployment_link_backend>
Frontend: <deployment_link_frontend>