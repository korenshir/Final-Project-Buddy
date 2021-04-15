//import express
const express=require('express');
var router= express.Router();
//import mongoose
const mongoose= require('mongoose');
require('custom-env').env(process.env.NODE_ENV,'./config'); 
mongoose.connect(process.env.CONNECTION_STRING,{ useUnifiedTopology: true, useNewUrlParser: true  });
const sensorsController = require('../controllers/sensorsController');
const { request } = require('express');




router.get('/',sensorsController.getAllSensors);

router.get('/byserial/:serialNumber',sensorsController.getSensorBySerialNumber); 

router.get('/soilMoisture/:_id',sensorsController.getSensorSoilMoisture);

router.get('/temperature/:_id',sensorsController.getSensorTemp);

router.get('/light/:_id',sensorsController.getSensorLight);

router.post('/',sensorsController.createSensor);

router.get('/:id',sensorsController.getSensorById);

router.delete('/:id',sensorsController.deleteSensor);

router.post('/data',sensorsController.RealTimeData)


module.exports=router; 