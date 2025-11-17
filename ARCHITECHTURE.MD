
### **`ARCHITECTURE.md`**

# Workspace Booking Platform - Architecture

## 1️⃣ Data Model

### User
- `_id`: ObjectId
- `name`: string
- `email`: string
- `password`: hashed string
- `role`: enum ["user", "admin"]

### Room
- `_id`: ObjectId
- `name`: string
- `capacity`: number
- `pricePerHour`: number
- `amenities`: array of strings

### Booking
- `_id`: ObjectId
- `userId`: ObjectId (ref User)
- `roomId`: ObjectId (ref Room)
- `startTime`: Date
- `endTime`: Date
- `status`: enum ["booked", "cancelled"]
- `price`: number

---

## 2️⃣ Conflict Handling
- Bookings are checked for overlapping times before creation:
  - `roomId` + `startTime` + `endTime`
  - Reject if conflict exists
- Cancellation allowed before booking start time

---

## 3️⃣ Pricing Method
- Price calculated dynamically:
  price = room.pricePerHour * duration_in_hours
Discounts or surge pricing can be added in future by admin role

4️⃣ Scaling Ideas
Database: Use MongoDB with indexes on roomId + startTime for fast conflict checks

API: Pagination for bookings and analytics

Caching: Redis for frequently accessed room data

Frontend: Code-splitting with React lazy load

Backend: Horizontal scaling via Docker/Kubernetes

5️⃣ AI Usage Notes
Smart Suggestions: Recommend available rooms based on user history

Dynamic Pricing: Adjust room price based on occupancy trends

Fraud Detection: Detect overlapping bookings or unusual admin activity







