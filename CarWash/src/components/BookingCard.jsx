import React from "react";
import { Link } from "react-router-dom";

export default function BookingCard({ booking, onDelete }) {
  return (
    <div className="card">
      <h3>{booking.customerName}</h3>
      <div className="small meta">{booking.carDetails?.make} {booking.carDetails?.model} • {booking.carDetails?.type}</div>
      <div className="small">{new Date(booking.date).toLocaleString()} • {booking.timeSlot}</div>
      <div className="small">Service: {booking.serviceType} • {booking.duration} mins</div>
      <div className="small">Price: ₹{booking.price} • Status: {booking.status}</div>

      <div className="actions">
        <Link to={`/bookings/${booking._id}`} className="btn">View</Link>
        <Link to={`/edit/${booking._id}`} className="btn">Edit</Link>
        <button className="danger" onClick={() => onDelete(booking._id)}>Delete</button>
      </div>
    </div>
  );
}
