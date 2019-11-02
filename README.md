# WeatherStation

## Arduino
### Install Aruidno IDE
I had to include "[DHT sensor library](https://github.com/adafruit/DHT-sensor-library)" and "[Adafruit Unified Sensor](https://github.com/adafruit/Adafruit_Sensor)" both by Adafruit

### Connect hardware

### Uploade code

[this video]https://www.youtube.com/watch?v=xGH2XmJy1co

## Raspberry Pi
### Setting up Raspberry Pi as web server with help from [this video](https://www.youtube.com/watch?v=N7c8CMuBx-Y)
- Install Raspbian (with Win32DiskImager)
- Swish (to talk to your RPi without monitor)
- Tera Term (to talk to command line)

### Install neededs software on your Raspberry Pi
- linux (Raspbian)
- Apache
- MySQL
- PHP
- SSH

Update existing software:
```
sudo apt-get update
sudo apt-get upgrade
```
Install new stuff:
``` 
sudo apt-get install apache2 mysql-server mysql-client php5 php5-mysql
```
Set up MySQL user/password:
"Root"/"****"

in browser confirm it works by typing in IP-address of RPi
Change permissions:
```
sud0 chmod 777 -R /var/www
```


### set up databae
localhost/phpmyadmin (Php myadmin?)

```
CREATE DATABASE WeatherDataBase;

CREATE TABLE Sources (
SourceID INT(6) NOT NULL AUTO_INCREMENT,
SourceName VARCHAR(20)
PRIMARY KEY(SourceID)
);

CREATE TABLE Measures (
MeasureTypeID INT(6) NOT NULL AUTO_INCREMENT,
MeasureType VARCHAR(20)
PRIMARY KEY(MeasureTypeID)
);

CREATE TABLE Locations (
LocationsID INT(6) NOT NULL AUTO_INCREMENT,
LocationName VARCHAR(20)
PRIMARY KEY(LocationsID)
);

CREATE TABLE EnvironmentalData (
MeasurementID INT(6) NOT NULL AUTO_INCREMENT, 
DateTime DATETIME, 
Source INT(6) REFERENCES Sources(SourceID), 
Location VARCHAR(20) REFERENCES Locations(LocationsID), 
Measurment VARCHAR(20) REFERENCES Measures(MeasureTypeID), 
Value DECIMAL(2,1),
PRIMARY KEY(MeasurementID)
);
```

## Website to load data
```
SELECT * FROM EnvironmentalData WHERE Location="Bedroom";
SELECT * FROM EnvironmentalData WHERE 'Date' > "2019-11-01";
```
