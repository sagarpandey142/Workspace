import React, { useState } from 'react';
import { getAnalytics } from '../api';

export default function Analytics(){
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState([]);

  async function fetchAnalytics(e){
    e?.preventDefault();
    if (!from || !to) return alert('Select from and to dates');
    const d = await getAnalytics(from, to);
    setData(d || []);
  }

  return (
    <div>
      <div className="card">
        <h2>Analytics</h2>
        <form onSubmit={fetchAnalytics} style={{display:'flex', gap:12, alignItems:'end'}}>
          <div className="field">
            <label>From</label>
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          </div>
          <div className="field">
            <label>To</label>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
          </div>
          <div>
            <button className="book-btn" onClick={fetchAnalytics}>Fetch</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Results</h3>
        {data.length === 0 ? <div className="small">No data</div> : (
          <table className="table">
            <thead><tr><th>Room</th><th>Total Hours</th><th>Total Revenue (₹)</th></tr></thead>
            <tbody>
              {data.map(row => (
                <tr key={row.roomId}>
                  <td>{row.roomName}</td>
                  <td>{row.totalHours}</td>
                  <td>₹{row.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
