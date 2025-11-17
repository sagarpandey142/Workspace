import React, { useEffect, useState } from 'react';
import Rooms from '../Pages/BookRoom';
import AllBookings from '../Pages/AllBooking';
import Analytics from '../Pages/Analytics';
import { getRooms, seedRooms, getToken, getUser, GetMyBooking } from '../api';
import MyBooking from "../Pages/MyBooking"


export default  function Dashboard() {
  const [view, setView] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [role, setRole] = useState('user'); 

  useEffect(() => {
    async function load() {
      const r = await getRooms();
      setRooms(r || []);

      // decode token to get role
      const token = getUser();
      console.log("token",token)
      if (token) {
        try {
          setRole(token || 'user');
        } catch (err) {
          console.error('Failed to decode token', err);
        }
      }
    }
    load();
  }, []);

  // quick seed helper (if no rooms)
  async function ensureSeed() {
    if (!rooms || rooms.length === 0) {
      await seedRooms();
      const r = await getRooms();
      setRooms(r || []);
      alert('Seeded rooms');
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Workspace Booking</h1>
        <div className="nav">
          <button onClick={() => setView('rooms')}>Rooms</button>
          <button onClick={() => setView('MyBooking')}>My Booking</button>
         {role==='admin' && <button onClick={() => setView('bookings')}>All Bookings</button> }
          {role === 'admin' && <button onClick={() => setView('analytics')}>Analytics</button>}
          {/* {role === 'admin' && <button onClick={ensureSeed} style={{ background: '#06b6d4' }}>Seed</button>} */}
        </div>
      </div>

      {view === 'rooms' && <Rooms rooms={rooms} onRoomsChange={setRooms} />}
      {view === 'MyBooking' && <MyBooking />}
      {view === 'bookings' && <AllBookings />}
      {view === 'analytics' && role === 'admin' && <Analytics />}
    </div>
  );
}
