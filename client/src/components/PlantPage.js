import '../css/Timeline.scss';
import { Redirect,useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom'
import axios from 'axios'
import React from 'react';
import DrawGraph from './Graph'
import ButtonsList from './ButtonsList';
import * as d3 from "d3"
import '../css/plantPage.css';
import Chart from './Chart';

const data = require('../files/data.json');

export default function Plant() {

  //const [soilMoisture, setSoilmoisture] = React.useState([])
  const history = useHistory();
  const ownerID = window.sessionStorage.getItem('userID');
  var index = window.location.toString().lastIndexOf('/') + 1
  const [plant, setPlant] = React.useState('');
  var plantResponse;
  const plantID = window.location.toString().substring(index)
  axios.get('http://localhost:8080/plant/' + plantID).then((Response) => {
    if (plant.length != Response.data.length) {
      plantResponse = {
        species: Response.data.species,
        status: Response.data.healtStatus,
        gardenID: Response.data.GardenID,
        sensorID: Response.data.sensorID
      };
      // setPlant(plantResponse);
      setPlant(Response.data)
    }
  })

  const [sensor,setSensor]=React.useState('');
  if(!sensor._id&&plant.sensorID)
  axios.get('http://localhost:8080/sensor/'+plant.sensorID).then((Response)=>{

  setSensor(Response.data)
  })


    return (
      <div>

      <section id="hero" className="d-flex align-items-center" style={{overflow:'scroll'}}>
          <section id="specials" className="specials" style={{backgroundColor: 'rgba(117, 128, 107,0.85)', marginTop:'0%', marginLeft:'9%', marginRight:'9%'}}>
           
            <div className="container" data-aos="fade-up"  >

              <div className="row" data-aos="fade-up" data-aos-delay={100}>
                {/*Left buttons*/}
                <ButtonsList ownerID={ownerID} />


                <div className="col-lg-8 details order-2 order-lg-1">{/*main content*/}
                  <h2 style={{ fontSize: '30px' }}>{plant.species}</h2>


              
                  <Chart title='Soil Moisture' sensorData={sensor.soilMoisture} optimalValue={plant.optimalSoilMoisture}></Chart>


                  <div id="outer">

                    <Link style={{display:'inline-block',color:"black",background:"white",borderWidth:"thin",fontWeight:"normal",border:"black",fontSize:"14px" ,height:"45px" ,width:"110px"}}
                       className="nav-link"  tto={`/editPlant/${plantID}`}> &nbsp;&nbsp;Edit plant </Link>
                              &nbsp;&nbsp;&nbsp;

              <button style={{display:'inline-block',color:"black",background:"white",borderWidth:"thin",fontWeight:"normal",border:"black",fontSize:"14px" , height:"45px",width:"110px"}} onClick={()=>{
                      axios.delete('http://localhost:8080/plant/', { data: { plantID: plantID, gardenID: plant.gardenID } })
                      history.push('/myGardens')
                }}> Delete plant </button>


                    <div class="inner" >
                      {(!plant.sensorID) ? <form onSubmit={(e) => {
                        addSensor(e, plantID)
                        history.push('/myGardens')
                      }}>
                        <input type="submit" style={{textAlign:'left' ,display:'inline-block',boxShadow:'none', marginLeft:'10px', color:"black",background:"white",borderWidth:"thin",fontWeight:"normal",border:"black",fontSize:"12px" ,borderRadius:'0px' , height:"45px" ,width:"60px"}} value="Add sensor" /><br />
                      </form> : null}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>
        </section>
      </div>
    );

  }



function addSensor(e, plantID) {

  e.preventDefault();

  const newSensor = {
    plantID: plantID
  }

  axios.post('http://localhost:8080/sensor/', newSensor);

}

function addPhoto(e, plantID) {
  e.preventDefault();
  document.getElementById('photoLink').value = 'Uploaded';
  const newPhoto = {
    link: document.getElementById('photoLink').value,
    plantID: plantID
  }

  axios.post('http://localhost:8080/photo/', newPhoto);

}



