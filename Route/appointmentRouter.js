const express = require("express");
const router = express.Router({ mergeParams: true });

const { verifytoken } = require("../middleware/verifyToken");
const { requestAppointment, assignAppoinment, getAllAppointment } = require("../Controller/appointmentController");

router.post("/property/:propertyId/appointment", verifytoken, requestAppointment);
router.post("/property/:propertyId/appointment/:pendingId", verifytoken, assignAppoinment);
router.get("/appointment", verifytoken, getAllAppointment);

module.exports = router;