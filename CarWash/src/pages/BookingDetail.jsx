import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        alert("Failed to load");
      } finally { setLoading(false); }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete booking?")) return;
    try {
      await API.delete(`/bookings/${id}`);
      nav("/");
    } catch (err) { alert("Delete failed") }
  };

  if (loading) return <p>Loading...</p>;
  if (!booking) return <p>Not found</p>;

  return (
    <div className="detail">
      <h2>{booking.customerName}</h2>
      <p className="small">{booking.carDetails.make} {booking.carDetails.model} • {booking.carDetails.type}</p>
      <p>Date: {new Date(booking.date).toLocaleDateString()} • {booking.timeSlot}</p>
      <p>Service: {booking.serviceType} • {booking.duration} mins</p>
      <p>Price: ₹{booking.price}</p>
      <p>Status: {booking.status}</p>
      {booking.addOns?.length ? <p>Add-ons: {booking.addOns.join(", ")}</p> : null}
      <div style={{ marginTop: 12 }}>
        <Link to={`/edit/${booking._id}`} className="btn">Edit</Link>
        <button style={{ marginLeft: 8 }} onClick={handleDelete} className="danger">Delete</button>
      </div>
    </div>
  );
}
