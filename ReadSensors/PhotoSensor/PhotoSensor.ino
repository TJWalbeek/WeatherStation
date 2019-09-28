// assign pins
const int photo = A0;
const int temp = A1;
const int led = 9;

// set global vars
// int value;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  pinMode(photo, INPUT);
  pinMode(temp, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(led, HIGH);
  Serial.print("Light: ");
  Serial.print(analogRead(photo));
  Serial.print("; Temperature: ");
  Serial.println(analogRead(temp));
  delay(250);
  digitalWrite(led, LOW);
  delay(4750);
}
