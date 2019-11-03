# WeatherStation

## Arduino
### Install Aruidno IDE
I had to include "[DHT sensor library](https://github.com/adafruit/DHT-sensor-library)" and "[Adafruit Unified Sensor](https://github.com/adafruit/Adafruit_Sensor)" both by Adafruit

### Connect hardware

### Uploade code

[this video]https://www.youtube.com/watch?v=xGH2XmJy1co

## Raspberry Pi
Some useful tools to install on your PC first:
- Swish (to talk to your RPi without monitor)
- Tera Term (to talk to command line)

### To set up Raspberry Pi as web server we need to install:
- linux (Raspbian)
- Apache
- MySQL
- PHP
- SSH

If you don't know how to do that, there are good instructions out there, for example, follow instructions in this video:
[Setup a Raspberry Pi Web Server](https://www.youtube.com/watch?v=vzojwG7OB7c)

Don't forget to add "ssh" before booting your Pi

### On your RPi
Update existing software:
```
sudo apt-get update
sudo apt-get upgrade
```
[Install new stuff](https://howtoraspberrypi.com/how-to-install-web-server-raspberry-pi-lamp/):
``` 
sudo apt install apache2 
sudo apt install php php-mbstring
sudo apt install mariadb-server php-mysql mariadb-client
```
Set up MySQL user/password:
"Root"/"****"

in browser confirm it works by typing in IP-address of RPi
Change permissions:
```
sud0 chmod 777 -R /var/www

sudo phpenmod mysqli
sudo service apache2 restart

with help from 
https://randomnerdtutorials.com/raspberry-pi-apache-mysql-php-lamp-server/
and
https://randomnerdtutorials.com/esp32-esp8266-raspberry-pi-lamp-server/
https://randomnerdtutorials.com/esp32-esp8266-mysql-database-php/ 

```

 with help from [this video](https://www.youtube.com/watch?v=N7c8CMuBx-Y)
- Install Raspbian (with Win32DiskImager)






### set up databae
localhost/phpmyadmin (Php myadmin?)

```
mysql -u root -p

CREATE DATABASE WeatherDataBase;

USE WeatherDataBase;

CREATE TABLE Sources(
SourceID INT(6) NOT NULL AUTO_INCREMENT,
SourceName VARCHAR(20),
PRIMARY KEY(SourceID)
);

CREATE TABLE Measures(
MeasureTypeID INT(6) NOT NULL AUTO_INCREMENT,
MeasureType VARCHAR(20),
PRIMARY KEY(MeasureTypeID)
);

CREATE TABLE Locations(
LocationsID INT(6) NOT NULL AUTO_INCREMENT,
LocationName VARCHAR(20),
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

CREATE TABLE EnvironmentalData (
MeasurementID INT(6) NOT NULL AUTO_INCREMENT, 
DateTime TIMESTAMP, 
Source INT(6) REFERENCES Sources(SourceID), 
Location INT(6) REFERENCES Locations(LocationsID), 
Measurement INT(6) REFERENCES Measures(MeasureTypeID), 
Value DECIMAL(3,1),
PRIMARY KEY(MeasurementID)
);

to test:
show tables;
desc EnvironmentalData;
```

## Website to load data
```
SELECT * FROM EnvironmentalData WHERE Location="Bedroom";
SELECT * FROM EnvironmentalData WHERE 'Date' > "2019-11-01";
```
