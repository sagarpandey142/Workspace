import React, { useState, useEffect } from 'react';
import { postBooking, getRooms } from '../api';
import RoomCard from '../components/RoomCard';

export default function BookRoom({ rooms: initialRooms = [], onRoomsChange }) {
  const [rooms, setRooms] = useState(initialRooms || []);
  const [selected, setSelected] = useState('');
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    setRooms(initialRooms);
    if (initialRooms && initialRooms.length) setSelected(initialRooms[0]._id || initialRooms[0].id);
  }, [initialRooms]);

  async function submit(e){
    e.preventDefault();
    setResult(null);
    if (!selected || !name || !start || !end) return setResult({ error: 'Please fill all fields' });
    setLoading(true);
    try {
      const payload = {
        roomId: selected,
        userName: name,
        startTime: new Date(start).toISOString(),
        endTime: new Date(end).toISOString()
      };
      const res = await postBooking(payload);
      if (res && res.data) {
        if (res.ok) setResult({ ok: true, data: res.data });
        else setResult({ error: res.data?.error || 'Booking failed' });
      } else {
        setResult({ error: 'No response' });
      }
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Book a Room</h2>
        <form onSubmit={submit}>
          <div className="field">
            <label>Room</label>
            <select value={selected} onChange={e=>setSelected(e.target.value)}>
              {rooms.map(r => <option key={r._id || r.id} value={r._id || r.id}>{r.name} — ₹{r.baseHourlyRate}/hr</option>)}
            </select>
          </div>

          <div className="field">
            <label>Your name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="field">
            <label>Start time</label>
            <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
            <span className="small">Times are interpreted by server in Asia/Kolkata</span>
          </div>

          <div className="field">
            <label>End time</label>
            <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
          </div>

          <div style={{display:'flex', gap:8}}>
            <button className="book-btn" type="submit" disabled={loading}>{loading ? 'Booking...' : 'Book'}</button>
          </div>
        </form>

        <div style={{marginTop:12}}>
          {result && result.ok && (
            <div style={{padding:10, borderRadius:6, background:'#ecfdf5', color:'#065f46'}}>
              Booking confirmed — ID: {result.data.bookingId} — Price: ₹{result.data.totalPrice}
            </div>
          )}
          {result && result.error && (
            <div style={{padding:10, borderRadius:6, background:'#fff1f2', color:'#9f1239'}}>
              Error: {result.error}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Available Rooms</h3>
        {rooms.length === 0 && <div className="small">No rooms found. Click Seed to create sample rooms.</div>}
        {rooms.map(r => <RoomCard key={r._id || r.id} room={r} />)}
      </div>
    </div>
  );
}
