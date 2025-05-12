const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel= require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')
const moment = require('moment')

//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'ABCD';

const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1d' });
console.log('Generated Token :',token);
      
  
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async(req,res) => {
  try {
    const user = await userModel.findById({_id:req.body.userId});
    user.password = undefined;
    if(!user){
      return res.status(200).send({
        message: 'user not found',
        success:false
      })
    }else{
      res.status(200).send({
        success:true,
        data:user
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:'Auth error',
      success:false,
      error
    })
  }
};

//Apply Doctor CTRL
const applyDoctorController =async(req,res) => {
  try {
    const newDoctor = await doctorModel({...req.body,status:'pending'})
    await newDoctor.save()
    const adminUser = await userModel.findOne({isAdmin:true})
    const notification = adminUser.notification
    notification.push({
      type:'apply-doctor-request',
      message:`${newDoctor.firstName} ${newDoctor.lastName} has applied for Doctor Account`,
      data:{
        doctorId: newDoctor._id,
        name:newDoctor.firstName + " " + newDoctor.lastName,
        onCickPath:'/admin/doctors',

      }
    })
    await userModel.findByIdAndUpdate(adminUser._id,{notification});
    res.status(201).send({
      success:true,
      message:'Doctor Account Applied Successfully'

    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:'Error While appling for Doctor'
    });
  }
};

//Notification CTRL
const getAllNotificationController = async(req,res) => {
  try {
    const user = await userModel.findOne({_id:req.body.userId})
    const seennotification = user.seennotification
    const notification = user.notification
    seennotification.push(...notification)
    user.notification = []
    user.seennotification = notification
    const updateUser = await user.save()
    res.status(200).send({
      success:true,
      message:'All notification marked as read',
      data:updateUser,
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:'Error in notification',
      success:false,
      error
    })
  }
};


//Delete  notifications
const deleteAllNotificationController = async(req,res) => {
  try {
    const user = await userModel.findOne({_id:req.body.userId})
    user.notification = []
    user.seennotification = []
    const updatedUser = await user.save()
    updatedUser.password=undefined
    res.status(200).send({
      success:true,
      message:'Notification Deleted Successfully',
      data:updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Unable to delete all notification',
    })
  }
};

//Get all doctors
const getAllDoctorsController = async(req,res)=>{
  try {
    const doctors = await doctorModel.find({status:'Approved'})
    res.status(200).send({
      success:true,
      message:'Doctors list fetched successfully',
      data:doctors,

    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:'Error While fetching doctors'
    })
  }
}

//Book Appointment
const bookAppointmentController =  async(req,res) =>{
  try {
    req.body.date = moment(req.body.date,'DD-MM-YYYY').toISOString();
    req.body.time = moment(req.body.time,'HH:mm').toISOString();
    req.body.status="pending"
    const newAppointment = new appointmentModel(req.body)
    await newAppointment.save()
    const user = await userModel.findOne({_id: req.body.doctorInfo.userId})
    user.notification.push({
      type:'New-appointment-request',
      message:`A new Appointment request from ${req.body.userInfo.name}`,
      onCickPath:'/user/appointments'
    })
    await user.save();
    res.status(200).send({
      success:true,
      message:'Appointment Book Successfully'
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:'Error While Booking Appointment'
    });
  }
};

// Booking Availabillity controller

const bookingAvailabilityController = async (req,res) =>{
  try {
    const date = moment(req.body.date,'DD-MM-YYYY').toISOString()
    const fromTime = moment(req.body.time,'HH:mm').subtract(1, 'hours').toISOString()
    const toTime = moment(req.body.time,'HH:mm').add(1, 'hours').toISOString()
    const doctorId = req.body.doctorId
    const appointments = await appointmentModel.find({doctorId,
      date,
      time:{
        $gte:fromTime,$lte:toTime
      }
    })
    if(appointments.length > 0){
      return res.status(200).send({
        message:'Appointment not available at this time',
        success:true
      })
    }else{
      return res.status(200).send({
        success:true,
        message:'Appointments Available'
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:'Error in booking'
    })
  }
};

const userAppointmentsController = async(req,res) =>{
  try {
    const appointments = await appointmentModel.find({userId:req.body.userId})
    res.status(200).send({
      success:true,
      message:'User Appointments Fetch Successfully',
      data:appointments
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:'Error in user Appointments'
    })
  }

}

module.exports = { loginController, 
  registerController, 
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};
