const { response } = require('express');
const mongoose = require('mongoose');
const Notification = require('../models/notificationModel')
const Sensor = require('../models/sensorsModel')
const Garden = require('../models/gardenModel')
const Plant = require('../models/plantModel')


const createSensor = async(plantID)=>{
   var randomSerial= Math.floor(Math.random() * 100);     // returns a random integer from 0 to 90
    const sensor= new Sensor({
      serialNumber: randomSerial,
      plantID: plantID
   }); 

     await sensor.save((err,sensor)=>{
      mongoose.set('useFindAndModify', false);
         Plant.findByIdAndUpdate(plantID,{sensorID:sensor._id},(err,plant)=>{
         var sensorID= sensor._id;
         var day=1;
      setInterval(function() {
         if(day<9){
         var rand= Math.floor(Math.random() * 20);     // returns a random integer from 0 to 9
         fabricateData(sensorID,day,rand);
         day++;}
      }, 60 * 1);
   })
         return sensor;
      });
      
};

const getSensorById = async(id)=>{return await Sensor.findById(id)};
const getAllSensors = async()=>{return await Sensor.find({})};
 
const deleteSensor = async(id)=>{
   const sensor = await getSensorById(id);
   if(!sensor)
   return null;
   else
   await sensor.remove();
   return sensor;

};

const getSensorBySerialNumber = async(serialNumber)=>{
   const sensor = Sensor.findOne({serialNumber:serialNumber});
       if(!sensor){
           return null;}
       else{
           return sensor;}
}

 const fabricateData = async(sensorID,day,rand)=>{
   Sensor.findById(sensorID,(err,sensor)=>{
      if (sensor){      
       sensor.temperature.push({value:30+rand,date:new Date(2020, 7, day, 6, 0, 0, 0)});
       sensor.soilMoisture.push({value:60+rand,date:new Date(2020, 7, day, 6, 0, 0, 0)});
       sensor.light.push({value:60+rand, date:new Date(2020, 7, day, 6, 0, 0, 0)});
       
       sensor.temperature.push({value:30+rand,date:new Date(2020, 7, day, 18, 0, 0, 0)});
       sensor.soilMoisture.push({value:60+rand,date:new Date(2020, 7, day, 18, 0, 0, 0)});
       sensor.light.push({value:60+rand, date:new Date(2020, 7, day, 18, 0, 0, 0)});
      sensor.save();
      }
      });
    return true;
 };


 const realTimeData= async(serialNumber,soilMoisture,temperature,light)=>{

   await Sensor.findOne({serialNumber:serialNumber},(err,sensor)=>{
       if(err)
       return(err)
       if(sensor)
       {          
         sensor.temperature.push({value:temperature,date:new Date()});
         sensor.soilMoisture.push({value:soilMoisture,date:new Date()});
         sensor.light.push({value:light,date:new Date()});
         Plant.findOne({sensorID:sensor._id},(err,plant)=>{
            if(plant)
               Garden.findById(plant.GardenID,(err,garden)=>{
                  tempTest(plant,temperature)
                  soilTest(plant,soilMoisture)
                  lightTest(plant,light)

                  plant.healthStatus=(Math.abs(plant.tempStatus)+Math.abs(plant.moistStatus)+Math.abs(plant.lightStatus))/3
                  plant.save()
               })            
         })
        
          sensor.save()
         return (sensor)
       }
    })
 }

 const tempTest=async(plant,temperature)=>{
    
   
   //begining of test
     var status;
     var delta=temperature-plant.optimalTemp
     if(delta>7)
     status=3;
     else if(delta>2)
     status=2;
     else if(delta>-2)
     status=1;
     else if(delta>-7)
     status=-2;
     else 
     status=-3;

     //notification part 

     //gives notification only when the status changes for worse or first measurement which is not 1

     if(plant.tempStatus&&plant.tempStatus!=status &&status!=1 ||plant.tempStatus==null&&status!=1){
    
         Garden.findById(plant.GardenID,(err,garden)=>{

            if(garden)
            sendNotification(garden.userID,plant,status,'temperature')

         })                     
        
     }
     


  plant.tempStatus=status

   //   plant.save()
     
     
   
 }


 const soilTest=async(plant,soilMoisture)=>{

  

   var status;
   var delta=soilMoisture-plant.optimalSoilMoisture
   if(delta>20)
   status=3;
   else if(delta>10)
   status=2;
   else if(delta>-10)
   status=1;
   else if(delta>-20)
   status=-2;
   else 
   status=-3;


   if(plant.moistStatus&&plant.moistStatus!=status &&status!=1 ||plant.moistStatus==null&&status!=1){

      Garden.findById(plant.GardenID,(err,garden)=>{
   

         if(garden){
           
         sendNotification(garden.userID,plant,status,'soilMoisture')
         }

      })                     


   }
      
   plant.moistStatus=status

   // plant.save()


 }


 const lightTest=async(plant,light)=>{

   var status;
   var delta=light-plant.optimalSunExposure
   if(delta>20)
   status=3;
   else if(delta>10)
   status=2;
   else if(delta>-10)
   status=1;
   else if(delta>-20)
   status=-2;
   else 
   status=-3;


   if(plant.lightStatus&&plant.lightStatus!=status &&status!=1 ||plant.lightStatus==null&&status!=1){

      Garden.findById(plant.GardenID,(err,garden)=>{

         if(garden)
         sendNotification(garden.userID,plant,status,'sunExposure')

      })                     


   }
      
   plant.lightStatus=status

   // plant.save()


 }

 const sendNotification=(userID,plant,status,type)=>{
   const notification= new Notification({
      userID:userID, 
      plantStatus:status,
      seen:false,
      plantID:plant._id,
      type:type,
   });    


   notification.save()

 }


module.exports={
   getAllSensors, 
   createSensor,
   getSensorById,
   deleteSensor,
   fabricateData,
   getSensorBySerialNumber,
   realTimeData
};