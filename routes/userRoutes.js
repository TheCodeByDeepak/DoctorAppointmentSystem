const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userCtrl");
const authMiddlewares = require("../middlewares/authMiddlewares");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Authorization || POST
router.post('/getUserData',authMiddlewares , authController);
module.exports = router;

//Apply Doctor || POST
router.post('/apply-doctor',authMiddlewares , applyDoctorController);

//Notification Doctor || POST
router.post('/get-all-notification',authMiddlewares , getAllNotificationController);

//Delete Notification Doctor || POST
router.post('/delete-all-notification',authMiddlewares , deleteAllNotificationController);

//Get all doctor
router.get('/getAllDoctors', authMiddlewares, getAllDoctorsController);

//Book Appointment
router.post('/book-appointment', authMiddlewares, bookAppointmentController);

//Booking Availability
router.post('/booking-availbility', authMiddlewares, bookingAvailabilityController);

//Appointment List
router.get('/user-appointments', authMiddlewares, userAppointmentsController)


module.exports = router;
