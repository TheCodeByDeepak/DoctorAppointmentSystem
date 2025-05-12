const express = require('express')
const authMiddlewares = require("../middlewares/authMiddlewares");
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/adminCtrl');

const router = express.Router()

//GET METHOD || USERS
router.get('/getAllUsers', authMiddlewares, getAllUsersController)

//GET METHOD || DOCTORS
router.get('/getAllDoctors', authMiddlewares, getAllDoctorsController)

//POST ACCOUNT STATUS
router.post('/changeAccountStatus', authMiddlewares, changeAccountStatusController)
module.exports=router;