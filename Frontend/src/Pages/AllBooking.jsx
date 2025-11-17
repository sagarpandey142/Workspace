import React, { useEffect, useState } from 'react';
import { getBookings, cancelBooking } from '../api';

export default function AllBookings(){
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const b = await getBookings();
    setBookings(b || []);
    setLoading(false);
  }

  useEffect(()=> { load(); },[]);

  async function handleCancel(id) {
    if (!confirm('Cancel booking? This is allowed only if >2 hours before start.')) return;
    const r = await cancelBooking(id);
    if (r && r.ok) {
      alert('Cancelled');
      load();
    } else {
      alert('Cancel failed: ' + (r?.data?.error || 'Unknown'));
    }
  }

  return (
    <div>
      <div className="card">
        <h2>All Bookings</h2>
        {loading ? <div>Loading...</div> : (
          <table className="table">
            <thead>
              <tr><th>Room</th><th>User</th><th>Start</th><th>End</th><th>Price</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id || b.id}>
                  <td>{b.roomId?.name || b.roomId}</td>
                  <td>{b.userName}</td>
                  <td>{new Date(b.startTime).toLocaleString()}</td>
                  <td>{new Date(b.endTime).toLocaleString()}</td>
                  <td>₹{b.totalPrice}</td>
                  <td>{b.status}</td>
                  <td>{b.status === 'CONFIRMED' ? <button className="cancel-btn" onClick={()=>handleCancel(b._id)}>Cancel</button> : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
