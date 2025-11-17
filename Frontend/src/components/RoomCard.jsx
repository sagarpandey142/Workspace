import React from 'react';

export default function RoomCard({ room }) {
  return (
    <div className="room-row">
      <div>
        <div className="room-title">{room.name}</div>
        <div className="small">Capacity: {room.capacity} • Rate: ₹{room.baseHourlyRate}/hr</div>
      </div>
      <div className="price">₹{room.baseHourlyRate}/hr</div>
    </div>
  );
}
