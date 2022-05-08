const User = require("../Models/userregister");
const Appointment = require("../Models/appointments");
const Property = require("../Models/property");

const requestAppointment = async (req, res, next) => {
  try {
    const foundProperty = await Property.findById(req.params.propertyId);
    const requestingAppointmentId = foundProperty.Postedby;
    const foundUser = await User.findById(requestingAppointmentId);
    if(!foundUser) throw new Error("user not found");
    let pendingAppointment = {
      requestingId: req.user.id,
      propertyId: foundProperty._id,
    };
    foundUser.pendingAppointment.push(pendingAppointment);
    await foundUser.save();
    res.status(200).json(foundUser);
  } catch (e) {
    res.status(400).json({ errror: e.message });
  }
};

const assignAppoinment = async (req, res, next) => {
  try {
    const { pendingId } = req.params;
    const foundUser = await User.findById(req.user.id);
    const pendingInfo = foundUser.pendingAppointment.filter(app => pendingId === app._id.toString());
    const newAppointment = new Appointment({
      location: req.body.location,
      appointmentDate: req.body.date,
    });
    newAppointment.appointmentGiver = req.user.id;
    newAppointment.appointmentFor = pendingInfo[0].requestingId;
    newAppointment.property = pendingInfo[0].propertyId;
    await newAppointment.save();
    foundUser.activeAppointment.push(newAppointment._id);
    let filtered = foundUser.pendingAppointment.filter(a => pendingId !== a._id.toString());
    foundUser.pendingAppointment = filtered;
    const appointGetter = await User.findById(pendingInfo[0].requestingId);
    appointGetter.myAppointment.push(newAppointment._id);
    await appointGetter.save();
    await foundUser.save();
    res.status(200).json(newAppointment);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const foundAppointments = await Appointment.find({ appointmentGiver: req.user.id }).populate([{
      path: "appointmentGiver",
      select: ["_id", "username", "images", "email", "phoneNumber"]
    }, {
      path: "appointmentFor",
      select: ["_id", "username", "images", "email", "phoneNumber"]
    }]);
    if(!foundAppointments) throw new Error("no appointment for give user");
    res.status(200).json(foundAppointments);
  } catch (e) {
    res.status(400).json({"error": e.message});
  }
}

module.exports = {
  requestAppointment,
  assignAppoinment,
  getAllAppointment
};