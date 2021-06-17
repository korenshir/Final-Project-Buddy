#include <DHT.h>
#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <Adafruit_Sensor.h>

Adafruit_ADS1115 plant1; //GND ADDR
Adafruit_ADS1115 plant2; //VDD ADDR
Adafruit_ADS1115 plant3; //SDA ADDR
Adafruit_ADS1115 plant4; //SCL ADDR

#define DHTTYPE DHT11
#define DHTPIN 2 // D4 --> GPIO02
DHT dht(DHTPIN, DHTTYPE);

#define SERVER_IP "193.106.55.124:8080" // PC address with emulation on host
#define POST_URL "/data"
const char* SERVER = "193.106.55.124";
const int PORT = 8080;

// WiFi connection details
#define wifi "1032_Family"
const char *ssid_a = "1032_Family";
const char *wifi_pass_a = "Family1032";
const char *ssid_m = "Matan";
const char *wifi_pass_m = "0505646228";

// Moisture details
const int dryValue = 26000; // 19000
const int wetValue = 5000; // 7790

// Light details
const int shadeValue = 26000;
const int lightedValue = -1680;

int lowValue = 0;
int highValue = 100;
int highTemp = 50;

WiFiClient client;
HTTPClient http;

class SensorsInfo {

  public:

  String serialNumber;
  float temperature;
  float soilMoisture;
  float light;
};

void wifiConnect();
SensorsInfo readADSSensors(Adafruit_ADS1115 ads);
SensorsInfo adc2precent(int16_t adc_light, int16_t adc_moisture, int16_t adc_temp);
void printSensors(SensorsInfo sensors);
void setupADS();
void connectToServer();
void httpBegin();
void httpPost(String json);
String createJsonDoc(SensorsInfo sensors_info);

void setup() {
  Serial.begin(115200);

  //Connecting to Wifi
  wifiConnect();

  //setup ADS modules
  setupADS();
  
  dht.begin();
}

void loop(void) 
{
  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED)) {
    
    for (int i = 0; i <= 3; i++)
    { 
      SensorsInfo sensors_info;
      
      //read sensors information and convert to readable data
      switch (i)
      {
       case 0:
        httpBegin(); //Begin http request
        
        sensors_info = readADSSensors(plant1);
        sensors_info.serialNumber = "55";
        
        printSensors(sensors_info); // print sensors information
        httpPost(createJsonDoc(sensors_info)); // send http POST request
        delay(500);
        http.end();
        
        break;
       case 1:
        httpBegin(); //Begin http request
        
        sensors_info = readADSSensors(plant1);
        sensors_info.serialNumber = "13";
        
        printSensors(sensors_info); // print sensors information
        httpPost(createJsonDoc(sensors_info)); // send http POST request
        delay(500);
        http.end();
        
         break;
       case 2:
        httpBegin(); //Begin http request
        
        sensors_info = readADSSensors(plant1);
        sensors_info.serialNumber = "10";
        
        printSensors(sensors_info); // print sensors information
        httpPost(createJsonDoc(sensors_info)); // send http POST request
        delay(500);
        http.end();
        
         break;
       case 3:
        httpBegin(); //Begin http request
        
        sensors_info = readADSSensors(plant1);
        sensors_info.serialNumber = "22";
        
        printSensors(sensors_info); // print sensors information
        httpPost(createJsonDoc(sensors_info)); // send http POST request
        delay(500);
        http.end();
        
         break;
       default:
         break;
      }

      // send http POST request
      httpPost(createJsonDoc(sensors_info));
    }

    http.end();
  }
  delay(10000);
}

String createJsonDoc(SensorsInfo sensors_info)
{
  StaticJsonDocument<96> doc;
  String json;

  //create a json document
  doc["serialNumber"] = sensors_info.serialNumber;
  doc["temperature"] = sensors_info.temperature;
  doc["soilMoisture"] = sensors_info.soilMoisture;
  doc["light"] = sensors_info.light;
  
  // Serialize JSON document
  serializeJson(doc, json);

  return json;
}

void wifiConnect(){
  Serial.print("Wifi connecting to ");
  if(wifi == "matan"){
    Serial.println(ssid_m);
    WiFi.begin(ssid_m, wifi_pass_m);
  }
  else{
    Serial.println(ssid_a);
    WiFi.begin(ssid_a, wifi_pass_a);
  }
  
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.println(".");
  }
  Serial.println("");
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println();
}

SensorsInfo readADSSensors(Adafruit_ADS1115 ads){

  //gathering information from sensor
  int16_t adc_light, adc_moisture;
  float volts_light, volts_moisture;

  float temp = dht.readTemperature();
  delay(1000);

  adc_light = ads.readADC_SingleEnded(0);
  volts_light = ads.computeVolts(adc_light);
  delay(1000);
  
  adc_moisture = ads.readADC_SingleEnded(1);
  volts_moisture = ads.computeVolts(adc_moisture);
  delay(1000);

 
  
  return adc2precent(adc_light, adc_moisture, temp);
}

SensorsInfo adc2precent(int16_t adc_light, int16_t adc_moisture, float temp){

  SensorsInfo sensors_info;

  float lightValue = map(adc_light, shadeValue, lightedValue, lowValue, highValue);
  float moistureValue = map(adc_moisture, dryValue, wetValue, lowValue, highValue);

  sensors_info.temperature = temp;
  sensors_info.soilMoisture = moistureValue;
  sensors_info.light = lightValue;

  return sensors_info;
}

void printSensors(SensorsInfo sensors){

  Serial.println(" ");
  Serial.print("Plant ID: ");
  Serial.println(sensors.serialNumber);
  Serial.print("Soil Moisture: ");
  Serial.print(sensors.soilMoisture);
  Serial.println("%");
  Serial.print("Light: ");
  Serial.print(sensors.light);
  Serial.println("%");
  Serial.print("Temperature: ");
  Serial.print(sensors.temperature);
  Serial.println("C");
  Serial.println(" ");
}

void setupADS(){

  // Start ads1 module
  plant1.setGain(GAIN_ONE);
  plant1.begin(0x48);

  // Start ads2 module
  plant2.setGain(GAIN_ONE);
  plant2.begin(0x49);

  // Start ads3 module
  plant3.setGain(GAIN_ONE);
  plant3.begin(0x4A);

  // Start ads4 module
  plant4.setGain(GAIN_ONE);
  plant4.begin(0x4B);
}

void connectToServer(){
  
  // wait for Wifi connection
  if ((WiFi.status() == WL_CONNECTED)) {

    // wait for host connection
    if (!client.connect(SERVER, PORT)) {
      Serial.println("connection failed");
    }
  }
}

void httpBegin(){
  
  Serial.println("[HTTP] begin...\n");
  //configure targed server and url
  String httpUrl = "https://" SERVER_IP "/sensor" POST_URL;
  http.begin(client, httpUrl); //HTTP
  http.addHeader("Content-Type", "application/json");
}

void httpPost(String json){

  Serial.print("[HTTP] POST...\n");
  // start connection and send HTTP header and body
  int httpCode = http.POST(json);
  Serial.println();
  Serial.print(httpCode);
  Serial.println();
  
  // httpCode will be negative on error
  if (httpCode > 0) {
    // HTTP header has been send and Server response header has been handled
    Serial.printf("[HTTP] POST... code: %d\n", httpCode);

    // file found at server
    if (httpCode == HTTP_CODE_OK) {
      const String& payload = http.getString();
      Serial.println("received payload:\n");
      Serial.println("<<<<<<<<<<<<<<<<<<<<<<<<<");
      Serial.println(payload);
      Serial.println(">>>>>>>>>>>>>>>>>>>>>>>>>");
    }
  } else {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
  }
}