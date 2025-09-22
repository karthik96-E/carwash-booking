import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function BookingForm({ editMode }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    carDetails: { make: "", model: "", year: "", type: "sedan" },
    serviceType: "Basic Wash",
    date: new Date().toISOString().slice(0,10),
    timeSlot: "",
    duration: 30,
    price: 0,
    status: "Pending",
    addOns: []
  });

  useEffect(() => {
    if (id) {
      API.get(`/bookings/${id}`).then(res => {
        const b = res.data;
        setForm({
          customerName: b.customerName || "",
          carDetails: { make: b.carDetails?.make || "", model: b.carDetails?.model || "", year: b.carDetails?.year || "", type: b.carDetails?.type || "sedan" },
          serviceType: b.serviceType || "Basic Wash",
          date: (new Date(b.date)).toISOString().slice(0,10),
          timeSlot: b.timeSlot || "",
          duration: b.duration || 30,
          price: b.price || 0,
          status: b.status || "Pending",
          addOns: b.addOns || []
        });
      }).catch(()=>alert("Failed to load booking"));
    }
  }, [id]);

  const handleChange = (path, value) => {
    if (path.startsWith("carDetails.")) {
      setForm(prev => ({ ...prev, carDetails: { ...prev.carDetails, [path.split(".")[1]]: value } }));
    } else if (path === "addOns") {
      setForm(prev => ({ ...prev, addOns: value.split(",").map(s=>s.trim()).filter(Boolean) }));
    } else setForm(prev => ({ ...prev, [path]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.date) { alert("Please fill name and date"); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        carDetails: { ...form.carDetails, year: form.carDetails.year ? Number(form.carDetails.year) : undefined }
      };
      if (id) {
        await API.put(`/bookings/${id}`, payload);
      } else {
        await API.post("/bookings", payload);
      }
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    } finally { setLoading(false); }
  };

  return (
    <form className="detail" onSubmit={submit}>
      <h2>{id ? "Edit Booking" : "Add Booking"}</h2>

      <div className="form-row">
        <input placeholder="Customer name" value={form.customerName} onChange={e=>handleChange("customerName", e.target.value)} />
        <input type="date" value={form.date} onChange={e=>handleChange("date", e.target.value)} />
      </div>

      <div className="form-row">
        <input placeholder="Car make" value={form.carDetails.make} onChange={e=>handleChange("carDetails.make", e.target.value)} />
        <input placeholder="Car model" value={form.carDetails.model} onChange={e=>handleChange("carDetails.model", e.target.value)} />
        <input placeholder="Year" value={form.carDetails.year} onChange={e=>handleChange("carDetails.year", e.target.value)} />
        <select value={form.carDetails.type} onChange={e=>handleChange("carDetails.type", e.target.value)}>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
          <option value="luxury">Luxury</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-row">
        <select value={form.serviceType} onChange={e=>handleChange("serviceType", e.target.value)}>
          <option>Basic Wash</option>
          <option>Deluxe Wash</option>
          <option>Full Detailing</option>
        </select>
        <input placeholder="Time slot (e.g. 10:00-11:00)" value={form.timeSlot} onChange={e=>handleChange("timeSlot", e.target.value)} />
      </div>

      <div className="form-row">
        <input placeholder="Duration (mins)" type="number" value={form.duration} onChange={e=>handleChange("duration", e.target.value)} />
        <input placeholder="Price" type="number" value={form.price} onChange={e=>handleChange("price", e.target.value)} />
        <select value={form.status} onChange={e=>handleChange("status", e.target.value)}>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="form-row">
        <input placeholder="Add-ons (comma separated)" value={form.addOns.join(", ")} onChange={e=>handleChange("addOns", e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        <button type="button" onClick={()=>history.back()}>Cancel</button>
      </div>
    </form>
  );
}
