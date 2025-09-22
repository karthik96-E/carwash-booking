// const express = require("express");
// const Booking = require("../models/Booking");
// const router = express.Router();

// // GET all bookings
// router.get("/", async (req, res) => {
//   try {
//     const bookings = await Booking.find();
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET booking by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) return res.status(404).json({ message: "Not found" });
//     res.json(booking);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST create booking
// router.post("/", async (req, res) => {
//   try {
//     const booking = new Booking(req.body);
//     await booking.save();
//     res.status(201).json(booking);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // PUT update booking
// router.put("/:id", async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!booking) return res.status(404).json({ message: "Not found" });
//     res.json(booking);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // DELETE booking
// router.delete("/:id", async (req, res) => {
//   try {
//     const booking = await Booking.findByIdAndDelete(req.params.id);
//     if (!booking) return res.status(404).json({ message: "Not found" });
//     res.json({ message: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();

// Middleware to simulate logged-in user (replace with real auth)
const fakeAuth = (req, res, next) => {
  // Example: req.user = { id: "userId123", isAdmin: true/false }
  req.user = { id: "userId123", isAdmin: true }; // change for testing
  next();
};

router.use(fakeAuth);

// GET all bookings (with admin support, pagination, filters, search)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const serviceType = req.query.serviceType;
    const type = req.query.type;
    const status = req.query.status;
    const sort = req.query.sort; // "newest", "price_asc", "price_desc"
    const all = req.query.all === "true";

    let query = {};

    // If not admin or all flag not set, filter by user
    if (!req.user.isAdmin || !all) {
      query.userId = req.user.id;
    }

    // Filters
    if (serviceType) query.serviceType = serviceType;
    if (type) query.type = type;
    if (status) query.status = status;

    // Search by customer name or car
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { carModel: { $regex: search, $options: "i" } },
      ];
    }

    let bookingQuery = Booking.find(query);

    // Sorting
    if (sort === "newest") bookingQuery = bookingQuery.sort({ createdAt: -1 });
    if (sort === "price_asc") bookingQuery = bookingQuery.sort({ price: 1 });
    if (sort === "price_desc") bookingQuery = bookingQuery.sort({ price: -1 });

    // Pagination
    const total = await Booking.countDocuments(query);
    bookingQuery = bookingQuery.skip((page - 1) * limit).limit(limit);

    const bookings = await bookingQuery;

    res.json({
      data: bookings,
      meta: { page, limit, total },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    // If user is not admin and not owner, forbid
    if (!req.user.isAdmin && booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create booking
router.post("/", async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.user.id });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update booking
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    // If not admin and not owner, forbid
    if (!req.user.isAdmin && booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(booking, req.body);
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });

    // If not admin and not owner, forbid
    if (!req.user.isAdmin && booking.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await booking.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
