

import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import BookingDetail from "./pages/BookingDetail";
import BookingForm from "./pages/BookingForm";

// Example: Hardcoded admin for demo purposes
const isAdmin = true; // set to false for normal users

export default function App() {
  return (
    <div>
      <header className="topbar">
        <Link to="/"><h1>🚗 CarWash Booking</h1></Link>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/add" className="btn">Add Booking</Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          {/* Pass isAdmin prop to Home */}
          <Route path="/" element={<Home isAdmin={isAdmin} />} />

          <Route path="/bookings/:id" element={<BookingDetail />} />
          <Route path="/add" element={<BookingForm />} />
          <Route path="/edit/:id" element={<BookingForm editMode />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Carwash Booking • MERN • Demo</p>
      </footer>
    </div>
  );
}
