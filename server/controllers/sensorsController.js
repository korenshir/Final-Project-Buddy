const { request, response } = require('express');
const Sensor=require('../models/sensorsModel')
const SensorService = require('../services/sensorService'); 



const createSensor = async (request,response)=>{

    const newSensor=
    await SensorService.createSensor(
        request.body.plantID)
       
     response.json(newSensor);
}

const getAllSensors= async (request,response)=>{
    const sensors = await SensorService.getAllSensors();
    response.json(sensors);
}

const getSensorById = async(request,response)=>{
    const sensor= await SensorService.getSensorById(request.params.id)
   if (!sensor)
    return response.status(404).json({errors:['sensor not found']});
   response.json(sensor);
};
const deleteSensor = async (request,response)=>{
    const sensor= await SensorService.deleteSensor(request.body.id);
    
        if (!sensor){
        return response.status(404).json({errors:['sensor not found']});}
    response.send();
};

const getSensorSoilMoisture = async(request,response)=>{
    const sensor=await SensorService.getSensorById(request.params._id)
    if(!sensor)
    console.log('error')
    if(sensor.soilMoisture.length>10){
        const data=sensor.soilMoisture.slice(sensor.soilMoisture.length-1-10,sensor.soilMoisture.length-1)
        response.send(data)
    }
    else
    response.send(sensor.soilMoisture)
}
const getSensorTemp = async(request,response)=>{
    const sensor=await SensorService.getSensorById(request.params._id)
    if(!sensor)
    console.log('error')
    if(sensor.temperature.length>10){
        const data=sensor.soilMoisture.slice(sensor.soilMoisture.length-1-10,sensor.soilMoisture.length-1)
        response.send(data)
    }
    else
    response.send(sensor.soilMoisture)
}
const getSensorLight = async(request,response)=>{
    const sensor=await SensorService.getSensorById(request.params._id)
    if(!sensor)
    console.log('error')
    if(sensor.light.length>10){
        const data=sensor.soilMoisture.slice(sensor.soilMoisture.length-1-10,sensor.soilMoisture.length-1)
        response.send(data)
    }
    else
    response.send(sensor.soilMoisture)
}


const getSensorBySerialNumber = async (request,response)=>{
    const sensor = await SensorService.getSensorBySerialNumber(request.params.serialNumber);
    if (!sensor)
    response.json(null);
    response.json(sensor);
};

const RealTimeData= async (request,response)=>{
   const sensor= await SensorService.realTimeData(request.body.serialNumber,request.body.soilMoisture,request.body.temperature,request.body.light)
   response.send('ok')
}

module.exports={
    createSensor,
    getAllSensors,
    getSensorById,
    deleteSensor,
    getSensorSoilMoisture,
    getSensorTemp,
    getSensorLight,
    getSensorBySerialNumber,
    RealTimeData
 };
