#include <Adafruit_ESP8266.h>
#include <SoftwareSerial.h>
#include <DHT.h>

// Set network info
const char* ESP_SSID = ".......";
const char* ESP_PASS = ".......";

// define location to send data to
#define HOST     "http://10.0.0.10"     // Host to contact
#define PAGE     "/php/add_data.php?Source=1&Location=1&Measurement=3&Value=95" // Web page to request
#define PORT     80                     // 80 = HTTP default port

// Define pins on Teensy
#define ARD_RX_ESP_TX   0
#define ARD_TX_ESP_RX   1
#define ESP_RST         2
const int light_pin = A0; // Analog pin for ligth sensor
#define DHTPIN 6     // Digital pin for DHT
const int ledPin = 13;

// Three place holders for data
float lux;
float hum;
float tmp;

// Set up ID for this arduino and location.
String Location = "1"; // Bedroom
String Source = "1"; //Arduino1

// Measure types (depends on your data set)
// 1 = temp
// 2 = hum
// 3 = light

// Set up serial to talk to ESP8266
SoftwareSerial softser(ARD_RX_ESP_TX, ARD_TX_ESP_RX); // Arduino RX = ESP TX, Arduino TX = ESP RX
Adafruit_ESP8266 wifi(&softser, &Serial, ESP_RST);

// Set up DHT
#define DHTTYPE DHT22   // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE); //// Initialize DHT sensor for normal 16mhz Arduino

// Set up parameters for measure interval in ms
unsigned long DELAY_TIME = 10 * 60 * 1000;  // 10 min
unsigned long delayStart = 0;

char buffer[50]; // for post message

void setup() {
  pinMode(light_pin, INPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);

  dht.begin();

  wifi.setBootMarker(F("Version:1.1.0.0]\r\n\r\nready")); // Check your ESP firmware version.

  softser.begin(115200); // Soft serial connection to ESP8266
  Serial.begin(9600);
  //while(!Serial); // UART serial debug

  delay(2000);
  Serial.println(F("Begin Setup"));

  Serial.println(F("Checking firmware version..."));
  wifi.println(F("AT+GMR"));
  delay(500);
  if(wifi.readLine(buffer, sizeof(buffer))) {
    Serial.println(buffer);
    wifi.find(); // Discard the 'OK' that follows
  } else {
    Serial.println(F("error"));
  }

  wifi.println(F("AT+RST"));
  delay(500);
  if(wifi.readLine(buffer, sizeof(buffer))) {
    Serial.println(buffer);
    wifi.find();
  }

  wifi.println(F("AT+CWMODE=1")); //3?
  delay(500);
  if(wifi.readLine(buffer, sizeof(buffer))) {
    Serial.println(buffer);
    wifi.find();
  }

  Serial.print("Connecting to ");
  Serial.println(ESP_SSID);

  //Serial.print(F("AT+CWJAP=\""));
  //Serial.print(F(ESP_SSID));
  //Serial.print(F("\",\""));
  //Serial.print(F(ESP_PASS));
  //Serial.println(F("\""));

  wifi.print(F("AT+CWJAP=\""));
  wifi.print(F(ESP_SSID));
  wifi.print(F("\",\""));
  wifi.print(F(ESP_PASS));
  wifi.println(F("\""));

  delay(5000);
  if(wifi.readLine(buffer, sizeof(buffer))) {
    Serial.println(buffer);
    wifi.find();
  };// Discard the 'OK' that follows}

  wifi.println(F("AT+CIFSR"));
  delay(1000);
  if(wifi.readLine(buffer, sizeof(buffer))) {
    Serial.println(buffer);
    wifi.find();
  };// Discard the 'OK' that follows}

  delayStart = millis();
  Serial.println(F("done setup"));
  digitalWrite(ledPin, LOW);
}

void loop() {
  if (millis() - delayStart >= DELAY_TIME) {
    delayStart += DELAY_TIME;

    digitalWrite(ledPin, HIGH);


    // read sensors
    tmp = read_temp();
    //Serial.println(tmp);
    hum = read_hum();
    //Serial.println(hum);
    lux = read_light();
    //Serial.println(lux);

    String mes_temp = create_temp_message();
    String mes_hum = create_hum_message();
    String mes_light = create_light_message();

    //print_message(mes_temp);
    send_message(mes_temp);

    delay(2500);

    //print_message(mes_hum);
    send_message(mes_hum);

    delay(2500);

    //print_message(mes_light);
    send_message(mes_light);


    Serial.println("Done sending");
    digitalWrite(ledPin, LOW);
  }
}

void send_message(String myStr) {
   //Serial.println(F("Connecting to host..."));
   wifi.println(F("AT+CIPSTART=\"TCP\",\"10.0.0.10\",80")); // AT+CIPSTART="TCP","10.0.0.10",80
   delay(1000);
    if(wifi.readLine(buffer, sizeof(buffer))) {
      //Serial.println(buffer);
      wifi.find(); };// Discard the 'OK' that follows}


   char message[myStr.length()+1]; // set up a char with the right length
   myStr.toCharArray(message,myStr.length()+1); // convert the string to char for accurate "size of"

  wifi.print(F("AT+CIPSEND="));
  wifi.println(sizeof(message)+1);
  delay(1000);
  wifi.println(myStr);
  delay(1000);
   if(wifi.readLine(buffer, sizeof(buffer))) {
     //Serial.println(buffer);
     wifi.find(); };// Discard the 'OK' that follows}

  wifi.println(F("AT+CIPCLOSE"));
}

String create_light_message(){
  lux = read_light();
  String myStr = "GET /php/add_data.php?Source=";
  myStr = myStr + Source;
  myStr = myStr + "&Location=";
  myStr = myStr + Location;
  myStr = myStr + "&Measurement=";
  myStr = myStr + 3; // light
  myStr = myStr + "&Value=";
  myStr = myStr + String(lux);
  return myStr;
}
String create_temp_message(){
  tmp = read_temp();
  String myStr = "GET /php/add_data.php?Source=";
  myStr = myStr + Source;
  myStr = myStr + "&Location=";
  myStr = myStr + Location;
  myStr = myStr + "&Measurement=";
  myStr = myStr + 1; //temp
  myStr = myStr + "&Value=";
  myStr = myStr + String(tmp);
  return myStr;
}
String create_hum_message(){
  hum = read_hum();
  String myStr = "GET /php/add_data.php?Source=";
  myStr = myStr + Source;
  myStr = myStr + "&Location=";
  myStr = myStr + Location;
  myStr = myStr + "&Measurement=";
  myStr = myStr + 2; //hum
  myStr = myStr + "&Value=";
  myStr = myStr + String(hum);
  return myStr;
}

int read_light(){
  int L;
  L = analogRead(light_pin);
  return L;
}

int read_hum(){
  int H;
  H = dht.readHumidity();
  return H;
}

int read_temp(){
  int T;
  T = dht.readTemperature();
  return T;
}
