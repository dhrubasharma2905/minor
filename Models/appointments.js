const mongoose = require("mongoose");
const {
  ObjectId
} = mongoose.Schema

const appointmentSchema = new mongoose.Schema({
  appointmentDate: {
    type: Date,
  },
  property: {
    type: ObjectId,
    ref: "Property"
  },
  appointmentTime: {
    type: String,
  },
  location: {
    type: String,
  },
  appointmentGiver: {
    type: ObjectId,
    ref: "Register"
  },
  appointmentFor: {
    type: ObjectId,
    ref: "Register"
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Appointment", appointmentSchema);