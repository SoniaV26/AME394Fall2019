#include <Arduino.h>


char * HOSTNAME = "red";
char * WifiPASS = "12345678";

#include <WiFi.h>
#include <WebServer.h>
#include <TTGO.h>
TTGOClass *ttgo;


WebServer server(80);


void setup() {
    Serial.begin(115200);
    ttgo = TTGOClass::getWatch();
    ttgo->begin();
    ttgo->openBL();

    

    // Start Wifi AP
    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP(HOSTNAME, WifiPASS);


      
    // handle index -- HTTP Server

    
    server.on("/", []() {
      digitalWrite(21, 1);
      String v = server.arg("v");
      
      Serial.println(v);
      // write `v` String to Screen
      //eg: you did this in A1
       
      server.send(200, "text/html", "<html><head><script>function foo(){var v = document.getElementById('theText').value;window.location.href=\"./?v=\" + v}</script></head><body><input type='text' maxlength='100' id='theText'><button  onclick='foo()'  > Submit </button></body><script>document.getElementById(\"theText\").value=window.location.search.replace(\"?v=\",\"\")</script><html>");
      ttgo->eTFT->fillScreen(TFT_BLACK);
      ttgo->eTFT->setTextColor(TFT_WHITE, TFT_BLACK);
      ttgo->eTFT->setTextFont(4);
      ttgo->eTFT->drawString('v', 50,110);
    });

    
    server.begin();
    
}

void loop() {
    server.handleClient();  
}
