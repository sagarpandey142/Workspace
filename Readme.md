🚀 Workspace Booking Platform

A full-stack Workspace Booking System built with:

React + Vite (Frontend)

Node.js / Express (Backend)

MongoDB (Database)

JWT Authentication

Users can sign up, log in, book rooms, cancel bookings, and view their reservation history.
Admins can seed rooms, view analytics, and manage booking operations.

📦 Project Setup
1️⃣ Clone the Repository
git clone https://github.com/sagarpandey142/Workspace
cd Workspace

2️⃣ Install Dependencies
🔹 Backend
cd backend
npm install

🔹 Frontend
cd frontend
npm install

3️⃣ Configure Environment Variables
🛠 Backend (backend/.env)
PORT=4000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>

🖥 Frontend (frontend/.env)
VITE_API_BASE=http://localhost:4000

4️⃣ Run the Application
▶ Backend
cd backend
npm run dev

▶ Frontend
cd frontend
npm run dev


🌐 Open the App:
http://localhost:5173
 (Vite default port)

⚡ API Endpoints (Samples)
1️⃣ Signup

POST /api/auth/signup

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user"
}

2️⃣ Login

POST /api/auth/login

{
  "email": "john@example.com",
  "password": "securepassword"
}

3️⃣ Get All Rooms

GET /api/rooms/
Headers: Authorization: Bearer <token>

4️⃣ Create Booking

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

7️⃣ Analytics (Admin Only)

GET /api/bookings/analytics?from=2025-11-01&to=2025-11-30
Authorization: Bearer <token>

🌐 Deployment Links

Backend (Render): https://workspace-wl4t.onrender.com

Frontend (Vercel): https://workspace-ten-dun.vercel.app/
