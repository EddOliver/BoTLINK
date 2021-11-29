#include "DHT.h"

#include <SPI.h>

#define DHTPIN 2

#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);



#include "LoRaWAN.h"

const char *devEui = "your-deveui";
const char *appEui = "your-appeui";
const char *appKey = "your-appkey";

// Max Payload 53 Bytes for DR 1
//const uint8_t payload[] = "Kharon Protocol Testing Device";

uint8_t payload[] = {0};

uint8_t total[] = {0};


void setup( void )
{
    Serial.begin(9600);

    Serial.println(F("DHTxx test!"));

    dht.begin();
    
    while (!Serial) { }

    // US Region
    LoRaWAN.begin(US915);
    // Helium SubBand
    LoRaWAN.setSubBand(2);
    // Disable Adaptive Data Rate
    LoRaWAN.setADR(false);
    // Set Data Rate 1 - Max Payload 53 Bytes
    LoRaWAN.setDataRate(1);
    // Device IDs and Key
    LoRaWAN.joinOTAA(appEui, appKey, devEui);

    Serial.println("JOIN( )");

    
}

void loop( void )
{

      // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
    float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
    float f = dht.readTemperature(true);

    if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
    }
    Serial.print(F("Humidity: "));
    Serial.print(h);
    Serial.print(F("%  Temperature: "));
    Serial.print(t);
    Serial.print(F("°C "));
    String data = String(h) + ": Humidity " + " Temp: " + String(t)+ " °C ";
    int dataLength = data.length(); dataLength++;
    char total[dataLength];
    data.toCharArray(total, dataLength);

    
    if (LoRaWAN.joined() && !LoRaWAN.busy())
    {
        Serial.print("TRANSMIT( ");
        Serial.print("TimeOnAir: ");
        Serial.print(LoRaWAN.getTimeOnAir());
        Serial.print(", NextTxTime: ");
        Serial.print(LoRaWAN.getNextTxTime());
        Serial.print(", MaxPayloadSize: ");
        Serial.print(LoRaWAN.getMaxPayloadSize());
        Serial.print(", DR: ");
        Serial.print(LoRaWAN.getDataRate());
        Serial.print(", TxPower: ");
        Serial.print(LoRaWAN.getTxPower(), 1);
        Serial.print("dbm, UpLinkCounter: ");
        Serial.print(LoRaWAN.getUpLinkCounter());
        Serial.print(", DownLinkCounter: ");
        Serial.print(LoRaWAN.getDownLinkCounter());
        Serial.println(" )");
        Serial.print(total);
        LoRaWAN.beginPacket();
        LoRaWAN.write(total);
        
        LoRaWAN.endPacket();

        // Send Packet
        //LoRaWAN.sendPacket(1, payload, sizeof(payload));
        //LoRaWAN.sendPacket(1, total, dataLength);
    }

    delay(20000); //20 Seconds
}
