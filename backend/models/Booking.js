const mongoose = require("mongoose");

const CarDetailsSchema = new mongoose.Schema({
  make: { type: String, default: "" },
  model: { type: String, default: "" },
  year: { type: Number },
  type: { type: String, enum: ["sedan","suv","hatchback","luxury","other"], default: "other" }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  carDetails: { type: CarDetailsSchema, default: {} },
  serviceType: { type: String, enum: ["Basic Wash","Deluxe Wash","Full Detailing"], default: "Basic Wash" },
  date: { type: Date, required: true },
  timeSlot: { type: String, default: "" },
  duration: { type: Number, default: 30 }, // minutes
  price: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending","Confirmed","Completed","Cancelled"], default: "Pending" },
  rating: { type: Number, min: 1, max: 5 },
  addOns: { type: [String], default: [] }
}, { timestamps: true });

BookingSchema.index({ customerName: "text", "carDetails.make": "text", "carDetails.model": "text" });

module.exports = mongoose.model("Booking", BookingSchema);
