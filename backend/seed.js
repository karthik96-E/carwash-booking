require("dotenv").config();
const mongoose = require("mongoose");
const Booking = require("./models/Booking");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/carwash";

const sample = [
  {
    customerName: "Ravi Kumar",
    carDetails: { make: "Hyundai", model: "i20", year: 2019, type: "hatchback" },
    serviceType: "Basic Wash",
    date: new Date(),
    timeSlot: "10:00-10:30",
    duration: 30,
    price: 200,
    status: "Pending",
    addOns: []
  },
  {
    customerName: "Anita Sharma",
    carDetails: { make: "Maruti", model: "Swift", year: 2021, type: "hatchback" },
    serviceType: "Deluxe Wash",
    date: new Date(Date.now() + 24*3600*1000),
    timeSlot: "11:00-12:00",
    duration: 60,
    price: 500,
    status: "Confirmed",
    addOns: ["Interior Cleaning"]
  },
  {
    customerName: "Suresh Reddy",
    carDetails: { make: "Honda", model: "City", year: 2018, type: "sedan" },
    serviceType: "Full Detailing",
    date: new Date(Date.now() - 48*3600*1000),
    timeSlot: "09:00-11:00",
    duration: 120,
    price: 2500,
    status: "Completed",
    rating: 5
  },
  {
    customerName: "Priya Patel",
    carDetails: { make: "BMW", model: "3 Series", year: 2020, type: "luxury" },
    serviceType: "Full Detailing",
    date: new Date(Date.now() + 5*24*3600*1000),
    timeSlot: "13:00-15:00",
    duration: 120,
    price: 5000,
    status: "Confirmed",
    addOns: ["Polishing"]
  },
  {
    customerName: "Arjun Das",
    carDetails: { make: "Mahindra", model: "XUV700", year: 2023, type: "suv" },
    serviceType: "Deluxe Wash",
    date: new Date(Date.now() + 2*24*3600*1000),
    timeSlot: "15:00-16:00",
    duration: 60,
    price: 800,
    status: "Pending"
  },
  {
    customerName: "Meera Joshi",
    carDetails: { make: "Toyota", model: "Camry", year: 2017, type: "sedan" },
    serviceType: "Basic Wash",
    date: new Date(Date.now() + 7*24*3600*1000),
    timeSlot: "08:00-08:30",
    duration: 30,
    price: 300,
    status: "Cancelled"
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to mongo");
    await Booking.deleteMany({});
    await Booking.insertMany(sample);
    console.log("Sample data inserted");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
