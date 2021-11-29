from network import LoRa
import socket
import time
from machine import UART
from config import dev_eui, app_eui, app_key
from machine import Pin
from dth import DTH

th = DTH(Pin('P3', mode=Pin.OPEN_DRAIN),0)

data = None

lora = LoRa(mode=LoRa.LORAWAN, region=LoRa.US915)

# imported from config.py dev_eui, app_eui, app_key

for i in range(0,8):
    lora.remove_channel(i)
for i in range(16,65):
    lora.remove_channel(i)
for i in range(66,72):
    lora.remove_channel(i)

lora.join(activation=LoRa.OTAA, auth=(dev_eui, app_eui, app_key), timeout=0)

while not lora.has_joined():
    time.sleep(2.5)
    print('Not yet joined...')

time.sleep(1)
print('Joined')
s = socket.socket(socket.AF_LORA, socket.SOCK_RAW)
s.setsockopt(socket.SOL_LORA, socket.SO_DR, 1)
result = th.read()

while 1:
    result = th.read()
    if result.is_valid():
        temp = result.temperature
        hum = result.humidity
        string = "Temp:{}, Hum:{}".format(temp,hum)
        print(string)
        s.setblocking(True)
        s.send(string.encode())
        s.setblocking(False)
        time.sleep(30)
