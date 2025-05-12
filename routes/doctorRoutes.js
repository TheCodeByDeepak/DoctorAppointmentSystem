const express = require('express');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require('../controllers/doctorCtrl')
const authMiddlewares = require('../middlewares/authMiddlewares')
const router = express.Router()

//POST Single Doctor Information
router.post('/getDoctorInfo',authMiddlewares, getDoctorInfoController)


//POST UPDATE PROFILE

router.post('/updateProfile',authMiddlewares,updateProfileController)

//POST GET SINGLE DOCTTOR INFO
router.post('/getDoctorById', authMiddlewares, getDoctorByIdController )

//Get Appointments
router.get('/doctor-appointments', authMiddlewares, doctorAppointmentsController);

//POST Update Status
router.post('/update-status', authMiddlewares, updateStatusController);


module.exports = router