import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { createBooking, getMyBookings } from '../controllers/bookingController.js';

const router = express.Router();
router.use(protect); 

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get('/provider/:providerId', restrictTo('serviceProvider', 'admin'), async (req, res) => {
  // implement later
});

// ... more routes (cancel, confirm, etc.)

export default router;