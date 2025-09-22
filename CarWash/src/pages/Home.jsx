




import React, { useEffect, useState } from "react";
import API from "../api";
import BookingCard from "../components/BookingCard";
import Pagination from "../components/Pagination";

export default function Home({ isAdmin = false }) {
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 8, total: 0 });
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("");

  async function fetchBookings(page = 1) {
    setLoading(true);
    try {
      const params = {
        page,
        limit: meta.limit,
        search: q || undefined,
        serviceType: serviceFilter || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        sort: sort || undefined,
        all: isAdmin || undefined, // fetch all bookings if admin
      };

      const res = await API.get("/bookings", { params });

      setBookings(Array.isArray(res.data?.data) ? res.data.data : []);
      setMeta(res.data?.meta || { page: 1, limit: 8, total: 0 });
    } catch (err) {
      console.error(err);
      setBookings([]);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings(1);
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!confirm("Delete booking?")) return;
    try {
      await API.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      setMeta((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const doSearch = () => fetchBookings(1);

  return (
    <div>
      <h2>{isAdmin ? "All Bookings (Admin)" : "My Bookings"}</h2>

      <div className="controls">
        <input
          placeholder="Search customer or car (press Enter)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
        />
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
          <option value="">All services</option>
          <option>Basic Wash</option>
          <option>Deluxe Wash</option>
          <option>Full Detailing</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All car types</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
          <option value="luxury">Luxury</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by date</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low→high</option>
          <option value="price_desc">Price: high→low</option>
        </select>
        <button className="btn" onClick={doSearch}>Search</button>
        <button onClick={() => {
          setQ(""); setServiceFilter(""); setTypeFilter(""); setStatusFilter(""); setSort("");
          fetchBookings(1);
        }}>Reset</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <>
          <div className="grid">
            {bookings.map((b) => (
              <BookingCard key={b._id || b.id} booking={b} onDelete={handleDelete} />
            ))}
          </div>

          <Pagination
            page={meta.page}
            total={meta.total}
            limit={meta.limit}
            onChange={fetchBookings}
          />
        </>
      )}
    </div>
  );
}
